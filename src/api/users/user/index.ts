import { request } from "@/utils/service"
import type * as PublicType from "../types"

export function getUserList(params: PublicType.UserListRequest) {
  return request<PublicType.UserListResponseData>({
    url: "pub/current/user",
    params: params,
    method: "get"
  })
}
