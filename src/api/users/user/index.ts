import { request } from "@/utils/service"
import type * as PublicType from "../types"

export function getUserList(params: PublicType.UserListRequest) {
  return request<PublicType.UserListResponseData>({
    url: "users",
    params: params,
    method: "get"
  })
}

export function createUser(data: PublicType.UserCreateRequest) {
  return request<PublicType.UserCreateRequest>({
    url: "users",
    data: data,
    method: "post"
  })
}

export function changeUser(data: PublicType.UserCreateRequest) {
  return request<PublicType.UserCreateRequest>({
    url: `users/${data.id}`,
    data: data,
    method: "put"
  })
}