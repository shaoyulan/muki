/**
 * @description 這是一個抽象的 HttpClient 類，定義了基本的 HTTP 請求方法，以及攔截器的設定方法。
 *
 * 原則上不要改動本程式碼，而是在子類中實作這些方法。
 *
 */

export interface HttpOptions {
  headers?: Record<string, string>
  [key: string]: unknown
}

// eslint-disable-next-line
export interface HttpRequestOptions<T = any> {
  baseUrl?: string
  data?: T
  options?: HttpOptions
}

// eslint-disable-next-line
type RequestInterceptor = (url: string, options: any) => Promise<any>
// eslint-disable-next-line
type ResponseInterceptor = (response: any) => Promise<any>
// eslint-disable-next-line
type ErrorInterceptor = (error: any) => Promise<any>

export default abstract class HttpClient {
  protected requestInterceptor: RequestInterceptor | null = null
  protected responseInterceptor: ResponseInterceptor | null = null
  protected errorInterceptor: ErrorInterceptor | null = null

  // 設定每次請求前自動執行的攔截器，能返回修改後的 options
  setRequestInterceptor(callback: RequestInterceptor): void {
    this.requestInterceptor = callback
  }

  // 設定每次請求後自動處理 response 的攔截器
  setResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptor = interceptor
  }

  // 設定錯誤處理攔截器
  setHandleErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptor = interceptor
  }

  // 生成最終的 options，並在請求前調用 requestInterceptor
  // eslint-disable-next-line
  protected async generateOptions<T>(url: string, options: any): Promise<T> {
    if (this.requestInterceptor) {
      return await this.requestInterceptor(url, options)
    }
    return options
  }

  // 在回傳 response 之前處理 response 攔截器
  // eslint-disable-next-line
  protected async handleResponse<T>(response: any): Promise<T> {
    if (this.responseInterceptor) {
      return await this.responseInterceptor(response)
    }
    return response
  }

  // 錯誤處理方法
  // eslint-disable-next-line
  protected async handleError<T>(error: any): Promise<T> {
    if (this.errorInterceptor) {
      return await this.errorInterceptor(error)
    }
    return error
  }

  // 抽象的 CRUD 方法，交由子類實作
  abstract get(url: string, options?: HttpRequestOptions): unknown
  abstract post(url: string, options: HttpRequestOptions): unknown
  abstract put(url: string, options: HttpRequestOptions): unknown
  abstract delete(url: string, options?: HttpRequestOptions): unknown
}
