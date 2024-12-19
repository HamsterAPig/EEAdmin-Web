import { request } from "@/utils/service"
import type * as Login from "./types/login"

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
