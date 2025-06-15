import HttpClient, { HttpRequestOptions } from './httpClient';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

class AxiosHttpClient extends HttpClient {
  private baseUrl = '';

  constructor(config?: { baseUrl: string }) {
    super();
    this.baseUrl = config?.baseUrl || '';
  }

  async get<T>(url: string, { baseUrl: optBaseUrl = '', options = {} }: HttpRequestOptions = {}): Promise<T | null> {
    try {
      const finalOptions = await this.generateOptions(url, options);
      const finalUrl = (optBaseUrl || this.baseUrl) + url;

      const response: AxiosResponse<T> = await axios.get(finalUrl, finalOptions);
      return await this.handleResponse(response.data);
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async post<T>(url: string, { baseUrl: optBaseUrl = '', data, options = {} }: HttpRequestOptions): Promise<T | null> {
    try {
      const finalOptions = await this.generateOptions(url, options);
      const finalUrl = (optBaseUrl || this.baseUrl) + url;

      const response: AxiosResponse<T> = await axios.post(finalUrl, data, finalOptions);
      return await this.handleResponse(response.data);
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async put<T>(url: string, { baseUrl: optBaseUrl = '', data, options = {} }: HttpRequestOptions): Promise<T | null> {
    try {
      const finalOptions = await this.generateOptions(url, options);
      const finalUrl = (optBaseUrl || this.baseUrl) + url;

      const response: AxiosResponse<T> = await axios.put(finalUrl, data, finalOptions);
      return await this.handleResponse(response.data);
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async delete<T>(url: string, { baseUrl: optBaseUrl = '', options = {} }: HttpRequestOptions = {}): Promise<T | null> {
    try {
      const finalOptions = await this.generateOptions(url, options);
      const finalUrl = (optBaseUrl || this.baseUrl) + url;

      const response: AxiosResponse<T> = await axios.delete(finalUrl, finalOptions);
      return await this.handleResponse(response.data);
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  handleError(error: any): void {
    if (this.errorInterceptor) {
      this.errorInterceptor(error);
    } else {
      console.error("AxiosHttpClient Error:", error.message);
      // 可以進一步分類錯誤
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
      } else {
        console.error("General error:", error);
      }
    }
  }
}

export default AxiosHttpClient;