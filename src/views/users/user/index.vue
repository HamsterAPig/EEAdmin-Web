<script lang="ts" setup>
import { nextTick, reactive, ref } from "vue"
import { type ElMessageBoxOptions, ElMessageBox, ElMessage } from "element-plus"
import type * as UserInfoStruct from "@/api/users/types"
import * as UserInfoFun from "@/api/users/user"
import {
  type VxeGridInstance,
  type VxeGridProps,
  type VxeModalInstance,
  type VxeModalProps,
  type VxeFormInstance,
  type VxeFormProps
} from "vxe-table"

import VxeUI, { VxeFormItemPropTypes, VxeSelectProps } from "vxe-pc-ui"
import { userInfo } from "node:os"

defineOptions({
  // 命名当前组件
  name: "VxeTableUserInfo"
})

//#region vxe-grid
interface RowMeta extends UserInfoStruct.UserResponse {
  /** vxe-table 自动添加上去的属性 */
  _VXE_ID?: string
}

const rolesItemRender = reactive<VxeFormItemPropTypes.ItemRender<RowMeta, VxeSelectProps>>({
  name: "VxeSelect",
  options: []
})

const xGridDom = ref<VxeGridInstance>()
const xGridOpt: VxeGridProps = reactive({
  loading: true,
  autoResize: true,
  height: "auto",
  /** 分页配置项 */
  pagerConfig: {
    align: "right"
  },
  /** 表单配置项 */
  formConfig: {
    items: [
      {
        field: "username",
        itemRender: {
          name: "$input",
          props: { placeholder: "用户名", clearable: true }
        }
      },
      {
        field: "phone",
        itemRender: {
          name: "$input",
          props: { placeholder: "手机号", clearable: true }
        }
      },
      {
        itemRender: {
          name: "$buttons",
          children: [
            {
              props: { type: "submit", content: "查询", status: "primary" }
            },
            {
              props: { type: "reset", content: "重置" }
            }
          ]
        }
      }
    ]
  },
  /** 工具栏配置 */
  toolbarConfig: {
    refresh: true,
    custom: true,
    slots: { buttons: "toolbar-btns" }
  },
  /** 自定义列配置项 */
  customConfig: {
    /** 是否允许列选中  */
    checkMethod: ({ column }) => !["username"].includes(column.field)
  },
  /** 列配置 */
  columns: [
    {
      type: "checkbox",
      width: "50px"
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
      field: "roles",
      title: "角色"
      /** 自定义列与 type: "html" 的列一起使用，会产生错误，所以采用 TSX 实现 */
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
      title: "状态"
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
      showOverflow: false,
      slots: { default: "row-operate" }
    }
  ],
  /** 数据代理配置项（基于 Promise API） */
  proxyConfig: {
    /** 启用动态序号代理 */
    seq: true,
    /** 是否代理表单 */
    form: true,
    /** 是否自动加载，默认为 true */
    // autoLoad: false,
    props: {
      total: "total"
    },
    ajax: {
      query: ({ page }) => {
        xGridOpt.loading = true
        crudStore.clearTable()
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
            pageSize: page.pageSize,
            current: page.currentPage
          } as UserInfoStruct.UserListRequest
          /** 调用接口 */
          UserInfoFun.getUserList(params).then(callback).catch(callback)
        })
      }
    }
  }
})
//#endregion

//#region vxe-modal
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
//#endregion

//#region vxe-form
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
        name: "VxeSelect",
        options: [
          { label: "启用", value: 1 },
          { label: "禁用", value: 2 }
        ]
      }
    },
    {
      field: "user_roles",
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
      { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_ ]+$/, message: "用户名仅允许字母开头，且不应包含除字母数字空格外的字符" }
    ],
    real_name: [
      { required: true, message: "真名不能为空" },
      { min: 2, max: 20, message: "长度应介于2到20之间" },
      { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_ ]+$/, message: "用户名仅允许字母开头，且不应包含除字母数字空格外的字符" }
    ],
    password: [
      { required: true, message: "密码不能为空" },
      { min: 6, max: 20, message: "密码长度应为6-16个字符" },
      { pattern: /^[A-Za-z0-9]+$/, message: "密码只能包含字母和数字" }
    ],
    email: [{ pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "邮箱格式不正确" }],
    phone: [{ pattern: /^1[3-9]\d{9}$/, message: "电话号码格式不正确" }]
  }
})
//#endregion

//#region 增删改查
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
        ElMessage.success("操作成功")
        VxeUI.modal.notification({
          content: "操作成功",
          status: "success"
        })
        !crudStore.isUpdate && crudStore.afterInsert()
        crudStore.commitQuery()
      }
      if (crudStore.isUpdate) {
        // 模拟调用修改接口成功
        setTimeout(() => callback(), 1000)
      } else {
        UserInfoFun.createUser(xFormOpt.data)
          .then(callback)
          .catch((error) => {
            VxeUI.modal.notification({
              content: error,
              status: "error"
            })
          })
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
    const tip = `确定 <strong style="color: var(--el-color-danger);"> 删除 </strong> 用户 <strong style="color: var(--el-color-primary);"> ${row.user_name} </strong> ？`
    const config: ElMessageBoxOptions = {
      type: "warning",
      showClose: true,
      closeOnClickModal: true,
      closeOnPressEscape: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    }
    ElMessageBox.confirm(tip, "提示", config).then(() => {
      // deleteTableDataApi(row.id).then(() => {
      //   ElMessage.success("删除成功")
      //   crudStore.afterDelete()
      //   crudStore.commitQuery()
      // })
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
//#endregion
</script>

<template>
  <div class="app-container" :style="{ overflow: 'hidden' }">
    <!-- 表格 -->
    <vxe-grid ref="xGridDom" v-bind="xGridOpt">
      <!-- 左侧按钮列表 -->
      <template #toolbar-btns>
        <vxe-button status="primary" icon="vxe-icon-add" @click="crudStore.onShowModal()">新增用户</vxe-button>
        <vxe-button status="danger" icon="vxe-icon-delete">批量删除</vxe-button>
      </template>
      <!-- 操作 -->
      <template #row-operate="{ row }">
        <el-button link type="primary" @click="crudStore.onShowModal(row)">修改</el-button>
        <el-button link type="danger" @click="crudStore.onDelete(row)">删除</el-button>
      </template>
    </vxe-grid>
    <!-- 弹窗 -->
    <vxe-modal ref="xModalDom" v-bind="xModalOpt">
      <!-- 表单 -->
      <vxe-form ref="xFormDom" v-bind="xFormOpt" />
    </vxe-modal>
  </div>
</template>
