import type * as MenuType from "@@/apis/system/menu/types.ts"
import { request } from "@/http/axios.ts"

export function getMenuList(params: MenuType.MenuRequestParam) {
  return request<MenuType.MenuListResponse>({
    url: "menus",
    params,
    method: "get"
  })
}
