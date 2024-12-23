import type * as PublicType from "../types.ts"
import { request } from "@/http/axios.ts"

export function getRoleList(params: PublicType.RequestParams) {
  return request<PublicType.RoleListResponseData>({
    url: "roles",
    params,
    method: "get"
  })
}

export function getRoleListSelect(params: PublicType.RequestParams) {
  return request<PublicType.RoleListResponseData>({
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

export function createRole(data: PublicType.RoleCreateRequest) {
  return request<PublicType.RoleCreateResponse>({
    url: "roles",
    data,
    method: "post"
  })
}

export function changeRole(data: PublicType.RoleChangeRequest) {
  return request<PublicType.UserCreateRequest>({
    url: `roles/${data.id}`,
    data,
    method: "put"
  })
}

export function deleteRole(id: string) {
  return request<PublicType.RoleDeleteResponse>({
    url: `roles/${id}`,
    method: "delete"
  })
}
