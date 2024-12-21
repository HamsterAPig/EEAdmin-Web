import type * as PublicType from "../types"
import { request } from "@/utils/service"

export function getRoleList(params: PublicType.RequestParams) {
  return request<PublicType.RoleListResponseData>({
    url: "roles",
    params: params,
    method: "get"
  })
}
