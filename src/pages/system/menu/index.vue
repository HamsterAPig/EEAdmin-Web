<script lang="ts" setup>
import type * as MenuType from "@@/apis/system/menu/types.ts"

import type {
  VxeGridInstance,
  VxeGridProps
} from "vxe-table"
import { getMenuList } from "@@/apis/system/menu"
import { reactive, ref } from "vue"

defineOptions({
  // 命名当前组件
  name: "VxeTableUserInfo"
})

// #region vxe-grid
interface RowMeta extends MenuType.MenuResponse {
  /** vxe-table 自动添加上去的属性 */
  _VXE_ID?: string
}

const dataRef = ref<MenuType.MenuResponse[]>([])

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
  treeConfig: {
    transform: true,
    rowField: "id",
    parentField: "parent_id"
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
      type: "seq",
      fixed: "left"
    },
    {
      field: "name",
      title: "菜单名",
      treeNode: true
    },
    {
      field: "sequence",
      title: "权限等级"
    },
    {
      field: "icon",
      title: "菜单图标"
    },
    {
      field: "memo",
      title: "菜单说明"
    },
    {
      field: "parent_id",
      title: "父菜单ID",
      editRender: {
        name: "VxeSelect",
        options: dataRef as any,
        optionProps: {
          label: "name",
          value: "id"
        }
      }
    },
    {
      field: "parent_path",
      title: "父菜单路径",
      editRender: {
        name: "VxeSelect",
        options: dataRef as any,
        optionProps: {
          label: "parent_path",
          value: "id"
        }
      }
    },
    {
      field: "router",
      title: "router"
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
        props: { openValue: 1, closeValue: 2 }
      }
    },
    {
      field: "show_status",
      title: "显示",
      filters: [
        { label: "启用", value: "1" },
        { label: "禁用", value: "2" }
      ],
      filterMultiple: true,
      cellRender: {
        name: "VxeSwitch",
        props: { openValue: 1, closeValue: 2, readonly: true }
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
    const callback = (res: MenuType.MenuListResponse) => {
      if (res?.data) {
        // 总数
        total = res.data.pagination.total
        // 列表数据
        result = res.data.list
        dataRef.value = res.data.list
      }
      xGridOpt.loading = false
      // 返回值有格式要求，详情见 vxe-table 官方文档
      resolve({ total, result })
    }

    /** 接口需要的参数 */
    const params = {
      pageSize,
      current: currentPage
    } as MenuType.MenuRequestParam

    const filterItem = filterList[0]
    if (filterItem) {
      params.queryValue = filterItem.datas[0]
    }
    /** 调用接口 */
    getMenuList(params).then(callback).catch(callback)
  })
}

// #endregion
</script>

<template>
  <div class="app-container" :style="{ overflow: 'hidden' }">
    <!-- 表格 -->
    <vxe-grid ref="xGridDom" v-bind="xGridOpt" />
  </div>
</template>
