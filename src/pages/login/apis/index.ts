import type * as Login from "./type.ts"
import { request } from "@/http/axios.ts"

/** 登录并返回 Token */
export function loginApi(data: Login.LoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "pub/login",
    method: "post",
    data
  })
}

/** 获取用户详情 */
export function getUserInfoApi() {
  return request<Login.UserInfoResponseData>({
    url: "pub/current/user",
    method: "get"
  })
}

export function getCaptchaId() {
  return request<Login.CaptchaId>({
    url: "pub/login/captchaid",
    method: "get"
  })
}

export function logOut() {
  return request({
    url: "pub/login/exit",
    method: "post"
  })
}
