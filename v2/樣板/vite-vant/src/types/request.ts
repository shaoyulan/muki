import type { I18nObj, I18nLang, Paginate } from './index'

export enum ApiCode {
  SUCCESS = 0,
  PHONE_VALIDATION_REQUIRED = 30000,
  PHONE_VALIDATION_REQUIRED2 = 30001,
  LOGIN_EXPIRED = 10001,
}

export interface ApiResponse<T = unknown, C = ApiCode> {
  paginate?: Paginate
  expect?: Record<string, unknown>[] | Record<string, unknown>
  code: C
  data: T
  message: string
}

export namespace Api {
  export namespace Login {
    export namespace Post {
      export type Request = {
        username: string
        password: string
      }
      export type Response = ApiResponse<{
        access_token: string
        expires_at: string
        google2FA: boolean
        role_name: string
      }>
    }
  }
}
