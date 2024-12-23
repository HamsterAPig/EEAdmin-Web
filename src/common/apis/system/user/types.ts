import type { Pagination, RequestParams } from "@@/apis/system/types.ts"

export interface UserInfoBase {
  created_at: string // 时间字段
  creator: string // 创建者
  email: string // 邮箱
  id: string // 用户ID
  password: string // 密码
  phone: string // 电话
  real_name: string // 真实姓名
  status: number // 状态
  user_name: string // 用户名
}

export interface UserCreateRequest extends UserInfoBase {}

export interface UserResponse extends UserInfoBase {
  role_ids: string
}

export interface UserListRequest extends RequestParams {
  role_ids: string
}

export type UserListResponseData = ApiResponseData<{
  list: UserResponse[]
  pagination: Pagination
}>

export type UserCreateResponse = ApiResponseData<{
  id: string
}>
