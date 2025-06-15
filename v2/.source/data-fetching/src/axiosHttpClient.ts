import HttpClient, { HttpRequestOptions } from './httpClient';
import type { RequestErrorInfo } from './types'
import axios, { AxiosResponse } from 'axios';

class AxiosHttpClient extends HttpClient {
  private baseUrl = '';

  constructor(config?: { baseUrl: string }) {
    super();
    this.baseUrl = config?.baseUrl || '';
  }

  async get<T>(url: string, { baseUrl: optBaseUrl = '', options = {} }: HttpRequestOptions = {}): Promise<[RequestErrorInfo, null] | [ null, T]> {
    const finalOptions = await this.generateOptions<HttpRequestOptions>(url, options);
    const finalUrl = (optBaseUrl || this.baseUrl) + url;

    try {
      const response: AxiosResponse<T> = await axios.get(finalUrl, finalOptions);
      const result = response.data;
      return this.handleResponse<[RequestErrorInfo, null] | [ null, T]>(result)
    } catch (error) {
      return await this.handleError<[RequestErrorInfo, null]>(error)
    }
  }

  async post<T>(url: string, { baseUrl: optBaseUrl = '', data, options = {} }: HttpRequestOptions): Promise<[RequestErrorInfo, null] | [ null, T]> {
    const finalOptions = await this.generateOptions<HttpRequestOptions>(url, options);
    const finalUrl = (optBaseUrl || this.baseUrl) + url;

    try {
      const response: AxiosResponse<T> = await axios.post(finalUrl, data, finalOptions);
      const result = response.data;
      return this.handleResponse<[RequestErrorInfo, null] | [ null, T]>(result)
    } catch (error) {
      return await this.handleError<[RequestErrorInfo, null]>(error)
    }
  }

  async put<T>(url: string, { baseUrl: optBaseUrl = '', data, options = {} }: HttpRequestOptions): Promise<[RequestErrorInfo, null] | [ null, T]> {
    const finalOptions = await this.generateOptions<HttpRequestOptions>(url, options);
    const finalUrl = (optBaseUrl || this.baseUrl) + url;

    try {
      const response: AxiosResponse<T> = await axios.put(finalUrl, data, finalOptions);
      const result = response.data;
      return this.handleResponse<[RequestErrorInfo, null] | [ null, T]>(result)
    } catch (error) {
      return await this.handleError<[RequestErrorInfo, null]>(error)
    }
  }

  async delete<T>(url: string, { baseUrl: optBaseUrl = '', options = {} }: HttpRequestOptions = {}): Promise<[RequestErrorInfo, null] | [ null, T]> {
    const finalOptions = await this.generateOptions<HttpRequestOptions>(url, options);
    const finalUrl = (optBaseUrl || this.baseUrl) + url;

    try {
      const response: AxiosResponse<T> = await axios.delete(finalUrl, finalOptions);
      const result = response.data;
      return this.handleResponse<[RequestErrorInfo, null] | [ null, T]>(result)
    } catch (error) {
      return await this.handleError<[RequestErrorInfo, null]>(error)
    }
  }
}

export default AxiosHttpClient;