import type { App } from "vue"
import VxeUI from "vxe-pc-ui"

import VXETable from "vxe-table"
// https://github.com/x-extends/vxe-table-plugin-element
import VXETablePluginElement from "vxe-table-plugin-element"
import "vxe-pc-ui/lib/style.css"
import "vxe-table/lib/style.css"

VXETable.use(VXETablePluginElement)

/** 全局默认参数 */
VXETable.setConfig({
  /** 全局尺寸 */
  size: "medium",
  /** 全局 zIndex 起始值，如果项目的的 z-index 样式值过大时就需要跟随设置更大，避免被遮挡 */
  zIndex: 9999,
  /** 版本号，对于某些带数据缓存的功能有用到，上升版本号可以用于重置数据 */
  version: 0,
  table: {
    showHeader: true,
    showOverflow: "tooltip",
    showHeaderOverflow: "tooltip",
    autoResize: true,
    stripe: true,
    border: "inner",
    loading: true,
    height: "auto",
    scrollX: {
      enabled: true,
      gt: 500
    },
    scrollY: {
      enabled: true,
      gt: 32
    },
    customConfig: {
      storage: true
    },
    // round: false,
    emptyText: "暂无数据",
    rowConfig: {
      isHover: true,
      isCurrent: true,
      // 行数据的唯一主键字段名
      keyField: "_VXE_ID"
    },
    columnConfig: {
      resizable: true,
      drag: true
    },
    align: "center",
    headerAlign: "center"
  },
  pager: {
    // size: "medium",
    /** 配套的样式 */
    perfect: false,
    pageSize: 100,
    pagerCount: 7,
    pageSizes: [10, 100, 500, 1000, 2000, 5000],
    layouts: ["Total", "PrevJump", "PrevPage", "Number", "NextPage", "NextJump", "Sizes", "FullJump"]
  },
  modal: {
    minWidth: 500,
    minHeight: 400,
    lockView: true,
    mask: true,
    // duration: 3000,
    // marginSize: 20,
    dblclickZoom: false,
    showTitleOverflow: true,
    transfer: true,
    draggable: false
  }
})

export function installVxeTable(app: App) {
  /** Vxe Table 组件完整引入 */
  app.use(VxeUI).use(VXETable)
}
