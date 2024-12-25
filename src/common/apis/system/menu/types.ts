import type { Pagination, RequestParams } from "@@/apis/system/types.ts"

export interface MenuRequestParam extends RequestParams {
  show_status: number
  parent_id: number
}

export interface MenuResponse {
  created_at: string
  creator: string
  icon: string
  id: string
  memo: string
  name: string
  parent_id: string
  parent_path: string
  router: string
  sequence: number
  show_status: number
  status: number
  updated_at: string
  actions: MenuActions[]
}

export interface MenuActions {
  code: string
  id: string
  menu_id: string
  name: string
  resources: MenuActionsResources[]
}

export interface MenuActionsResources {
  action_id: string
  id: string
  method: string
  path: string
}

export type MenuListResponse = ApiResponseData<{
  list: MenuResponse[]
  pagination: Pagination
}>
