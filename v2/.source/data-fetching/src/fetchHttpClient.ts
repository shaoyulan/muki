import HttpClient, { HttpRequestOptions } from './httpClient';
import type { RequestErrorInfo } from './types'

type ConstructorOptions = {
  baseUrl: string;
}

class FetchHttpClient extends HttpClient {
  private baseUrl = '';

  constructor(config?: ConstructorOptions) {
    super();
    this.baseUrl = config?.baseUrl || '';
  }

  async get<T>(url: string, { baseUrl:optBaseUrl = '', options = {} }: HttpRequestOptions = {}): Promise<[RequestErrorInfo, null] | [ null, T]> {
    const finalOptions = await this.generateOptions<HttpRequestOptions>(url, options);
    const finalUrl = (optBaseUrl || this.baseUrl) + url;
    
    if (options?.transform) {
      console.warn('transform 請改在 setResponseInterceptor 處理')
    }

    try {
      const response = await fetch(finalUrl, {
        method: 'GET',
        ...finalOptions,
      });
      const result: T = await response.json();
      if(response.ok) {
        return this.handleResponse<[RequestErrorInfo, null] | [ null, T]>(result)
      } else {
        return this.handleError<[RequestErrorInfo, null] | [ null, T]>(new Error('404'))
      }
    } catch (error) {
      return await this.handleError<[RequestErrorInfo, null]>(error)
    }
  }

  async post<T>(url: string, { baseUrl:optBaseUrl = '', data, options = {} }: HttpRequestOptions): Promise<[RequestErrorInfo, null] | [ null, T]> {
    const finalOptions = await this.generateOptions<HttpRequestOptions>(url, options);
    const finalUrl = (optBaseUrl || this.baseUrl) + url;
    
    if (options?.transform) {
      console.warn('transform 請改在 setResponseInterceptor 處理')
    }

    try {
      const response = await fetch(finalUrl, {
        method: 'POST',
        body: JSON.stringify(data),
        ...finalOptions,
      });
      const result: T = await response.json();
      if(response.ok) {
        return this.handleResponse<[RequestErrorInfo, null] | [ null, T]>(result)
      } else {
        return this.handleError<[RequestErrorInfo, null] | [ null, T]>(new Error('404'))
      }
    } catch (error) {
      return await this.handleError<[RequestErrorInfo, null]>(error)
    }
  }

  async put<T>(url: string, { baseUrl:optBaseUrl = '', data, options = {} }: HttpRequestOptions): Promise<[RequestErrorInfo, null] | [ null, T]> {
    const finalOptions = await this.generateOptions<HttpRequestOptions>(url, options);
    const finalUrl = (optBaseUrl || this.baseUrl) + url;

    if (options?.transform) {
      console.warn('transform 請改在 setResponseInterceptor 處理')
    }

    try {
      const response = await fetch(finalUrl, {
        method: 'PUT',
        body: JSON.stringify(data),
        ...finalOptions,
      });
      const result: T = await response.json();
      if(response.ok) {
        return this.handleResponse<[RequestErrorInfo, null] | [ null, T]>(result)
      } else {
        return this.handleError<[RequestErrorInfo, null] | [ null, T]>(new Error('404'))
      }
    } catch (error) {
      return await this.handleError<[RequestErrorInfo, null]>(error)
    }
  }

  async delete<T>(url: string, { baseUrl:optBaseUrl = '', options = {} }: HttpRequestOptions = {}): Promise<[RequestErrorInfo, null] | [ null, T]> {
    const finalOptions = await this.generateOptions<HttpRequestOptions>(url, options);
    const finalUrl = (optBaseUrl || this.baseUrl) + url;
    
    if (options?.transform) {
      console.warn('transform 請改在 setResponseInterceptor 處理')
    }

    try {
      const response = await fetch(finalUrl, {
        method: 'DELETE',
        ...finalOptions,
      });
      const result: T = await response.json();
      if(response.ok) {
        return this.handleResponse<[RequestErrorInfo, null] | [ null, T]>(result)
      } else {
        return this.handleError<[RequestErrorInfo, null] | [ null, T]>(new Error('404'))
      }
    } catch (error) {
      return await this.handleError<[RequestErrorInfo, null]>(error)
    }
  }
}

export default FetchHttpClient;
