<script lang="ts" setup>
import type { RoleListResponseData } from "@@/apis/system/role/types.ts"
import type { RequestParams } from "@@/apis/system/types.ts"
import type * as UserInfoStruct from "@@/apis/system/user/types.ts"
import type { VxeFormItemPropTypes, VxeGridListeners, VxeSelectProps } from "vxe-pc-ui"

import type { VxeColumnPropTypes } from "vxe-pc-ui/types/components/column"
import type {
  VxeFormInstance,
  VxeFormProps,
  VxeGridInstance,
  VxeGridProps,
  VxeModalInstance,
  VxeModalProps
} from "vxe-table"
import { getRoleListSelect } from "@@/apis/system/role"
import * as UserInfoFun from "@@/apis/system/user"
import { nextTick, reactive, ref } from "vue"
import VxeUI from "vxe-pc-ui"

defineOptions({
  // 命名当前组件
  name: "VxeTableUserInfo"
})

// #region vxe-grid
interface RowMeta extends UserInfoStruct.UserResponse {
  /** vxe-table 自动添加上去的属性 */
  _VXE_ID?: string
}

const rolesItemOptions = ref([])
const rolesItemRender = reactive<VxeFormItemPropTypes.ItemRender<RowMeta, VxeSelectProps>>({
  name: "VxeSelect",
  props: {
    multiple: true,
    clearable: true
  },
  optionProps: {
    label: "name",
    value: "id"
  },
  options: rolesItemOptions as any
})
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
      field: "user_name",
      title: "用户名"
    },
    {
      field: "real_name",
      title: "真名"
    },
    {
      field: "role_ids",
      title: "角色",
      editRender: {
        name: "VxeSelect",
        props: {
          multiple: true
        },
        optionProps: {
          label: "name",
          value: "id"
        },
        options: rolesItemOptions as any
      }
    },
    {
      field: "password",
      title: "密码"
    },
    {
      field: "phone",
      title: "手机号"
    },
    {
      field: "email",
      title: "邮箱"
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
            UserInfoFun.changeUserStatus(cellParams.row.id, cellParams.row.status)
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
    const callback = (res: UserInfoStruct.UserListResponseData) => {
      if (res?.data) {
        // 总数
        total = res.data.pagination.total
        // 列表数据
        result = res.data.list
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
      } as RequestParams
      getRoleListSelect(params).then((res: RoleListResponseData) => {
        if (res?.data) {
          rolesItemOptions.value = res.data.list as never
        }
      })
    }
    /** 调用接口 */
    UserInfoFun.getUserList(params).then(callback).catch(callback)
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
  data: {} as UserInfoStruct.UserCreateRequest,
  /** 项列表 */
  items: [
    {
      field: "user_name",
      title: "用户名",
      itemRender: { name: "$input", props: { placeholder: "请输入" } }
    },
    {
      field: "real_name",
      title: "真名",
      itemRender: { name: "$input", props: { placeholder: "请输入" } }
    },
    {
      field: "password",
      title: "密码",
      itemRender: { name: "VxePasswordInput", props: { placeholder: "请输入" } }
    },
    {
      field: "phone",
      title: "电话号码",
      itemRender: { name: "$input", props: { placeholder: "请输入" } }
    },
    {
      field: "email",
      title: "邮箱",
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
      field: "role_ids",
      title: "角色",
      itemRender: rolesItemRender
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
    user_name: [
      { required: true, message: "字母开头5~10位数" },
      { min: 2, max: 20, message: "长度应介于2到20之间" },
      { pattern: /^[\u4E00-\u9FA5\w ]+$/, message: "用户名仅允许字母开头，且不应包含除字母数字空格外的字符" }
    ],
    real_name: [
      { required: true, message: "真名不能为空" },
      { min: 2, max: 20, message: "长度应介于2到20之间" },
      { pattern: /^[\u4E00-\u9FA5\w ]+$/, message: "用户名仅允许字母开头，且不应包含除字母数字空格外的字符" }
    ],
    password: [
      { required: true, message: "密码不能为空" },
      { min: 6, max: 20, message: "密码长度应为6-16个字符" },
      { pattern: /^[A-Z0-9]+$/i, message: "密码只能包含字母和数字" }
    ],
    email: [{ pattern: /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, message: "邮箱格式不正确" }],
    phone: [{ pattern: /^1[3-9]\d{9}$/, message: "电话号码格式不正确" }]
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
      xModalOpt.title = "修改用户"
      // 赋值
      xFormOpt.data = row
      xFormOpt.data.password = ""
    } else {
      crudStore.isUpdate = false
      xModalOpt.title = "新增用户"
    }
    if (xFormOpt?.rules?.password?.[0]) {
      xFormOpt.rules.password[0].required = !crudStore.isUpdate
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
        UserInfoFun.changeUser(xFormOpt.data).then(callback)
      } else {
        UserInfoFun.createUser(xFormOpt.data).then(callback).catch(callback)
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
        content: `确认删除用户: ${row.user_name} ?`,
        escClosable: true
      })
      .then((type) => {
        if (type === "confirm") {
          UserInfoFun.deleteUser(row.id)
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
