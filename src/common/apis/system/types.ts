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

export interface UserResponse extends UserInfoBase {}

export interface RequestParams {
  current: number
  pageSize: number
  queryValue: string
  status: number
}

export interface UserListRequest extends RequestParams {
  role_ids: string
}

export interface RoleMenu {
  actionID: string
  id: string
  menuID: string
  roleID: string
}

export interface Role {
  createdAt: string
  creator: string
  id: string
  memo: string
  name: string
  roleMenus: RoleMenu[]
  sequence: number
  status: number
  updatedAt: string
}

export interface Pagination {
  current: number
  pageSize: number
  total: number
}

export type UserListResponseData = ApiResponseData<{
  list: UserResponse[]
  pagination: Pagination
}>

export type UserCreateResponse = ApiResponseData<{
  id: string
}>

export type RoleListResponseData = ApiResponseData<{
  list: Role[]
  pagination: Pagination
}>
