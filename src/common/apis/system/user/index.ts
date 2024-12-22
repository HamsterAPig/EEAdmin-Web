import type * as PublicType from "../types.ts"
import { request } from "@/http/axios.ts"

export function getUserList(params: PublicType.UserListRequest) {
  return request<PublicType.UserListResponseData>({
    url: "users",
    params,
    method: "get"
  })
}

export function createUser(data: PublicType.UserCreateRequest) {
  return request<PublicType.UserCreateRequest>({
    url: "users",
    data,
    method: "post"
  })
}

export function changeUser(data: PublicType.UserCreateRequest) {
  return request<PublicType.UserCreateRequest>({
    url: `users/${data.id}`,
    data,
    method: "put"
  })
}

export function changeUserStatus(id: string, status: number) {
  let ret
  if (status === 1) {
    ret = "enable"
  } else {
    ret = "disable"
  }
  return request({
    url: `users/${id}/${ret}`,
    method: "patch"
  })
}

export function deleteUser(id: string) {
  return request<PublicType.UserCreateRequest>({
    url: `users/${id}`,
    method: "delete"
  })
}
