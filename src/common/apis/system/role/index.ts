import type {
  RoleChangeRequest,
  RoleCreateRequest,
  RoleCreateResponse,
  RoleDeleteResponse,
  RoleListResponseData
} from "@@/apis/system/role/types.ts"
import type { RequestParams } from "@@/apis/system/types.ts"
import type { UserCreateRequest } from "@@/apis/system/user/types.ts"
import { request } from "@/http/axios.ts"

export function getRoleList(params: RequestParams) {
  return request<RoleListResponseData>({
    url: "roles",
    params,
    method: "get"
  })
}

export function getRoleListSelect(params: RequestParams) {
  return request<RoleListResponseData>({
    url: "roles.select",
    params,
    method: "get"
  })
}

export function changeRoleStatus(id: string, status: number) {
  let ret
  if (status === 1) {
    ret = "enable"
  } else {
    ret = "disable"
  }
  return request({
    url: `roles/${id}/${ret}`,
    method: "patch"
  })
}

export function createRole(data: RoleCreateRequest) {
  return request<RoleCreateResponse>({
    url: "roles",
    data,
    method: "post"
  })
}

export function changeRole(data: RoleChangeRequest) {
  return request<UserCreateRequest>({
    url: `roles/${data.id}`,
    data,
    method: "put"
  })
}

export function deleteRole(id: string) {
  return request<RoleDeleteResponse>({
    url: `roles/${id}`,
    method: "delete"
  })
}
