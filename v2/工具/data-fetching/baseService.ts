import FetchHttpClient from './fetchHttpClient';
import type { HttpRequestOptions } from './httpClient'
import type { RequestErrorInfo } from './types'

export enum ApiCode {
  SUCCESS = 0,
  LOGIN_EXPIRED = 10001,
}

export interface ApiResponse<T = unknown, C = ApiCode> {
  code: C
  data: T
  message: string
}

export const baseService = new FetchHttpClient({
  baseUrl: 'https://jsonplaceholder.typicode.com/',
});


/**
   * 處理 App 請求非成功的回應
   */
function handleAppNoneSuccessResponse(response: ApiResponse): [RequestErrorInfo, null] | [null, ApiResponse] {
  // 只處理非成功的部份
  if (response?.code !== ApiCode.SUCCESS) {
    if (response?.code === ApiCode.LOGIN_EXPIRED) {
      dDialog.fire({
        icon: 'error',
        title: '登入過期',
        text: '請重新登入',
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        // logout
      })
      const errorinfo: RequestErrorInfo = {
        message: '登入過期',
        orinalError: null,
      }
      return [errorinfo, null]
    }
  }

  // 沒有需要全域捕捉的App錯誤
  return [null, response]
}

baseService.setRequestInterceptor(async (url: string, reqOptions: HttpRequestOptions): Promise<HttpRequestOptions> => {
  if (!reqOptions?.['options']) {
    reqOptions.options = {} as Record<string, string>
  }

  if (!reqOptions?.['options']?.headers) {
    reqOptions.options.headers = {} as Record<string, string>
  }

  return reqOptions
})

baseService.setResponseInterceptor(async (response: ApiResponse): Promise<[RequestErrorInfo, null] | [null, ApiResponse]> => {
  if (response?.code !== ApiCode.SUCCESS) {
    return handleAppNoneSuccessResponse(response)
  }
  return [null, response]
})

baseService.setHandleErrorInterceptor(async (error: Error): Promise<[RequestErrorInfo, null]> => {
  const errorInfo: RequestErrorInfo = {
    message: error?.message || '發生錯誤，請稍後再試',
    orinalError: error,
  }
  return [errorInfo, null]
})