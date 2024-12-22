import type * as PublicType from "../types.ts"
import { request } from "@/http/axios.ts"

export function getRoleList(params: PublicType.RequestParams) {
  return request<PublicType.RoleListResponseData>({
    url: "roles",
    params,
    method: "get"
  })
}
