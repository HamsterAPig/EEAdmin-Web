export interface RequestParams {
  current: number
  pageSize: number
  queryValue: string
  status: number
}

export interface Pagination {
  current: number
  pageSize: number
  total: number
}
