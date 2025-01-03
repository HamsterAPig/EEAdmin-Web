<script lang="ts" setup>
import type { MenuListResponse, MenuRequestParam, MenuResponse } from "@@/apis/system/menu/types.ts"
import type * as RoleInterfaceType from "@@/apis/system/role/types.ts"
import type { RequestParams } from "@@/apis/system/types.ts"
import type { VxeGridListeners } from "vxe-pc-ui"

import type { VxeColumnPropTypes } from "vxe-pc-ui/types/components/column"
import type {
  VxeFormInstance,
  VxeFormProps,
  VxeGridInstance,
  VxeGridProps,
  VxeModalInstance,
  VxeModalProps
} from "vxe-table"
import { getMenuTreeList } from "@@/apis/system/menu"
import { changeRole, changeRoleStatus, createRole, deleteRole, getRoleList } from "@@/apis/system/role"
import { nextTick, reactive, ref } from "vue"
import VxeUI from "vxe-pc-ui"

defineOptions({
  // 命名当前组件
  name: "VxeTableUserInfo"
})

// #region vxe-grid
interface RowMeta extends Omit<RoleInterfaceType.Role, "role_menus"> {
  /** vxe-table 自动添加上去的属性 */
  _VXE_ID?: string
  role_menus: string[] // 重新定义 role_menus 为 string[] 类型
}

const menuItemOptions = ref<MenuResponse[]>([])
const nameFilterRender = reactive<VxeColumnPropTypes.FilterRender>({
  name: "VxeInput"
})
const xGridDom = ref<VxeGridInstance>()
const xGridOpt: VxeGridProps = reactive({
  id: "VxeUserInfo",
  loading: true,
  autoResize: true,
  height: "auto",
  /** 分页配置项 */
  pagerConfig: {
    align: "right"
  },
  filterConfig: {
    remote: true
  },
  customConfig: {
    storage: true
  },
  /** 工具栏配置 */
  toolbarConfig: {
    refresh: true,
    custom: true,
    buttons: [
      { icon: "vxe-icon-add", code: "add", status: "primary", circle: true },
      { icon: "vxe-icon-delete", code: "del", status: "error", circle: true },
      { icon: "vxe-icon-save", code: "save", status: "success", circle: true }
    ]
  },
  /** 列配置 */
  columns: [
    {
      type: "checkbox",
      fixed: "left",
      width: "50px"
    },
    {
      field: "id",
      filters: [{ data: "" }],
      filterRender: nameFilterRender,
      title: "ID"
    },
    {
      field: "name",
      title: "角色名"
    },
    {
      field: "sequence",
      title: "权限等级"
    },
    {
      field: "role_menus",
      title: "菜单权限",
      editRender: {
        name: "VxeSelect",
        props: {
          multiple: true
        },
        optionProps: {
          label: "name",
          value: "id"
        },
        options: menuItemOptions as any
      }
    },
    {
      field: "memo",
      title: "权限说明"
    },
    {
      field: "status",
      title: "状态",
      filters: [
        { label: "启用", value: "1" },
        { label: "禁用", value: "2" }
      ],
      filterMultiple: true,
      cellRender: {
        name: "VxeSwitch",
        props: { openValue: 1, closeValue: 2 },
        events: {
          change(cellParams: { row: RowMeta }) {
            changeRoleStatus(cellParams.row.id, cellParams.row.status)
          }
        }
      }
    },
    {
      field: "creator",
      title: "创建者"
    },
    {
      field: "created_at",
      title: "创建时间"
    },
    {
      title: "操作",
      width: "150px",
      fixed: "right",
      showOverflow: true,
      slots: { default: "row-operate" }
    }
  ],
  /** 数据代理配置项（基于 Promise API） */
  proxyConfig: {
    /** 启用动态序号代理 */
    seq: true,
    filter: true,
    props: {
      total: "total"
    },
    ajax: {
      query: ({ page, filters }) => {
        return findPageList(page.pageSize, page.currentPage, filters)
      }
    }
  }
})
// #endregion

function findPageList(pageSize: number, currentPage: number, filterList: any[]) {
  xGridOpt.loading = true
  return new Promise((resolve) => {
    let total = 0
    let result: RowMeta[] = []
    /** 加载数据 */
    const callback = (res: RoleInterfaceType.RoleListResponseData) => {
      if (res?.data) {
        // 总数
        total = res.data.pagination.total
        // 列表数据
        const ret = res.data.list
        result = ret.map(role => ({
          ...role,
          role_menus: role.role_menus.map(menu => menu.menu_id)
        }))
      }
      xGridOpt.loading = false
      // 返回值有格式要求，详情见 vxe-table 官方文档
      resolve({ total, result })
    }

    /** 接口需要的参数 */
    const params = {
      pageSize,
      current: currentPage
    } as RequestParams

    const filterItem = filterList[0]
    if (filterItem) {
      params.queryValue = filterItem.datas[0]
    } else {
      // 获取role列表
      const params = {
        status: 1
      } as MenuRequestParam
      getMenuTreeList(params).then((res: MenuListResponse) => {
        if (res?.data) {
          menuItemOptions.value = res.data.list
        }
      })
    }
    /** 调用接口 */
    getRoleList(params).then(callback).catch(callback)
  })
}

// #region vxe-modal
const xModalDom = ref<VxeModalInstance>()
const xModalOpt: VxeModalProps = reactive({
  title: "",
  showClose: true,
  escClosable: true,
  maskClosable: true,
  beforeHideMethod: () => {
    xFormDom.value?.clearValidate()
    return Promise.resolve()
  }
})
// #endregion

// #region vxe-form
const xFormDom = ref<VxeFormInstance>()
const xFormOpt: VxeFormProps = reactive({
  span: 24,
  titleWidth: "100px",
  loading: false,
  /** 是否显示标题冒号 */
  titleColon: false,
  /** 表单数据 */
  data: {} as RoleInterfaceType.RoleCreateRequest,
  /** 项列表 */
  items: [
    {
      field: "name",
      title: "角色名",
      itemRender: { name: "$input", props: { placeholder: "请输入" } }
    },
    {
      field: "sequence",
      title: "权限等级",
      itemRender: { name: "VxeNumberInput", props: { placeholder: "请输入" } }
    },
    {
      field: "role_menus",
      title: "菜单权限",
      itemRender: {
        name: "VxeSelect",
        props: {
          multiple: true
        },
        optionProps: {
          label: "name",
          value: "id"
        },
        options: menuItemOptions as any
      }
    },
    {
      field: "memo",
      title: "权限说明",
      itemRender: { name: "$input", props: { placeholder: "请输入" } }
    },
    {
      field: "status",
      title: "状态",
      itemRender: {
        name: "VxeSwitch",
        props: { openValue: 1, closeValue: 2 }
      }
    },
    {
      align: "right",
      itemRender: {
        name: "$buttons",
        children: [
          { props: { content: "取消" }, events: { click: () => xModalDom.value?.close() } },
          {
            props: { type: "submit", content: "确定", status: "primary" },
            events: { click: () => crudStore.onSubmitForm() }
          }
        ]
      }
    }
  ],
  /** 校验规则 */
  rules: {
    name: [{ required: true, message: "角色名必须填写" }],
    status: [{ required: true, message: "权限等级必须填写" }],
    sequence: [{ type: "number" }]
  }
})
// #endregion

const gridEvents: VxeGridListeners<RowMeta> = {
  toolbarButtonClick({ code }) {
    if (code === "add") {
      crudStore.onShowModal()
    }
  }
}

// #region 增删改查
const crudStore = reactive({
  /** 表单类型，true 表示修改，false 表示新增 */
  isUpdate: true,
  /** 加载表格数据 */
  commitQuery: () => xGridDom.value?.commitProxy("query"),
  /** 清空表格数据 */
  clearTable: () => xGridDom.value?.reloadData([]),
  /** 点击显示弹窗 */
  onShowModal: (row?: RowMeta) => {
    if (row) {
      crudStore.isUpdate = true
      xModalOpt.title = "修改角色"
      // 赋值
      xFormOpt.data = row
      xFormOpt.data.password = ""
    } else {
      crudStore.isUpdate = false
      xModalOpt.title = "新增角色"
    }
    xModalDom.value?.open()
    nextTick(() => {
      !crudStore.isUpdate && xFormDom.value?.reset()
      xFormDom.value?.clearValidate()
    })
  },
  /** 确定并保存 */
  onSubmitForm: () => {
    if (xFormOpt.loading) return
    xFormDom.value?.validate((errMap) => {
      if (errMap) return
      xFormOpt.loading = true
      const callback = () => {
        xFormOpt.loading = false
        xModalDom.value?.close()
        VxeUI.modal.notification({
          content: "操作成功",
          status: "success"
        })
        !crudStore.isUpdate && crudStore.afterInsert()
        crudStore.commitQuery()
      }
      if (crudStore.isUpdate) {
        changeRole(xFormOpt.data).then(callback)
      } else {
        createRole(xFormOpt.data).then(callback).catch(callback)
      }
    })
  },
  /** 新增后是否跳入最后一页 */
  afterInsert: () => {
    const pager = xGridDom.value?.getProxyInfo()?.pager
    if (pager) {
      const currentTotal = pager.currentPage * pager.pageSize
      if (currentTotal === pager.total) {
        ++pager.currentPage
      }
    }
  },
  /** 删除 */
  onDelete: (row: RowMeta) => {
    VxeUI.modal
      .confirm({
        title: "确认删除?",
        content: `确认删除角色: ${row.name} ?`,
        escClosable: true
      })
      .then((type) => {
        if (type === "confirm") {
          deleteRole(row.id)
          const $grid = xGridDom.value
          if ($grid) {
            $grid.remove(row)
          }
        }
      })
  },
  /** 删除后是否返回上一页 */
  afterDelete: () => {
    const tableData: RowMeta[] = xGridDom.value!.getData()
    const pager = xGridDom.value?.getProxyInfo()?.pager
    if (pager && pager.currentPage > 1 && tableData.length === 1) {
      --pager.currentPage
    }
  },
  /** 更多自定义方法 */
  moreFn: () => {}
})
// #endregion
</script>

<template>
  <div class="app-container" :style="{ overflow: 'hidden' }">
    <!-- 表格 -->
    <vxe-grid ref="xGridDom" v-bind="xGridOpt" v-on="gridEvents">
      <!-- 操作 -->
      <template #row-operate="{ row }">
        <el-button link type="primary" @click="crudStore.onShowModal(row)">
          修改
        </el-button>
        <el-button link type="danger" @click="crudStore.onDelete(row)">
          删除
        </el-button>
      </template>
    </vxe-grid>
    <!-- 弹窗 -->
    <vxe-modal ref="xModalDom" v-bind="xModalOpt">
      <!-- 表单 -->
      <vxe-form ref="xFormDom" v-bind="xFormOpt" />
    </vxe-modal>
  </div>
</template>
