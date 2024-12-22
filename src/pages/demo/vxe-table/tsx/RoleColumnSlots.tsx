import type { VxeColumnPropTypes } from "vxe-pc-ui/types/components/column"

export const RoleColumnSlots: VxeColumnPropTypes.Slots = {
  default: ({ row, column }) => {
    const cellValue = row[column.field]
    const type = cellValue === "admin" ? "primary" : "warning"
    return [<span class={`el-tag el-tag--${type} el-tag--plain`}>{cellValue}</span>]
  }
}
