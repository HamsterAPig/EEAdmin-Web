import { type VxeColumnPropTypes } from "vxe-pc-ui/types/components/column"

const slots: VxeColumnPropTypes.Slots = {
  default: ({ row, column }) => {
    const cellValue = row[column.field]
    console.log(cellValue)
    return [
      <span>
        <vxe-tag>{cellValue}</vxe-tag>
      </span>
    ]
  }
}

export default slots
