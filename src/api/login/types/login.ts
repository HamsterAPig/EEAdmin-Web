export interface LoginRequestData {
  captcha_code: string
  captcha_id: string
  password: string
  user_name: string
}

export type LoginResponseData = ApiResponseData<{ access_token: string; token_type: string; expires_at: number }>

export type UserInfoResponseData = ApiResponseData<{ username: string; roles: string[] }>

export type CaptchaId = ApiResponseData<{ captcha_id: string }>
