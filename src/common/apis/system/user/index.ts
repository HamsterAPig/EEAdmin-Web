import type { RequestParams } from "@@/apis/system/types.ts"
import type * as UserType from "./types.ts"
import { request } from "@/http/axios.ts"

export function getUserList(params: RequestParams) {
  return request<UserType.UserListResponseData>({
    url: "users",
    params,
    method: "get"
  })
}

export function createUser(data: UserType.UserCreateRequest) {
  return request<UserType.UserCreateResponse>({
    url: "users",
    data,
    method: "post"
  })
}

export function changeUser(data: UserType.UserCreateRequest) {
  return request<UserType.UserCreateRequest>({
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
  return request<UserType.UserCreateRequest>({
    url: `users/${id}`,
    method: "delete"
  })
}
