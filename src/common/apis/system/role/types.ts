import type { Pagination } from "@@/apis/system/types.ts"
import type { UserCreateResponse } from "@@/apis/system/user/types.ts"

export type RoleCreateResponse = UserCreateResponse

export type RoleListResponseData = ApiResponseData<{
  list: Role[]
  pagination: Pagination
}>

export interface RoleCreateRequest {
  name: string
  status: number
  sequence: number
  memo: string
  created_at: string
  updated_at: string
}

export interface RoleChangeRequest extends RoleCreateRequest {
  id: string
}

export type RoleDeleteResponse = ApiResponseData<{ status: string }>

export interface RoleMenu {
  action_id: string
  id: string
  menu_id: string
  role_id: string
}

export interface Role {
  created_at: string
  creator: string
  id: string
  memo: string
  name: string
  role_menus: RoleMenu[]
  sequence: number
  status: number
  updated_at: string
}
