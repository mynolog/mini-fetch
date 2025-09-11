/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MiniFetchOptions<T = any> extends Omit<RequestInit, 'body'> {
  body?: T
  autoParseJson?: boolean
  timeout?: number
}

export interface MiniFetchApi {
  get: <T = any>(url: string, options?: MiniFetchOptions) => Promise<MiniFetchResponse<T>>
  post: <T = any>(url: string, options?: MiniFetchOptions) => Promise<MiniFetchResponse<T>>
  patch: <T = any>(url: string, options?: MiniFetchOptions) => Promise<MiniFetchResponse<T>>
  put: <T = any>(url: string, options?: MiniFetchOptions) => Promise<MiniFetchResponse<T>>
  delete: <T = any>(url: string, options?: MiniFetchOptions) => Promise<MiniFetchResponse<T>>
}

export interface MiniFetchRequest extends RequestInit {
  autoParseJson?: boolean
  timeout?: number
}

export interface MiniFetchResponse<T = any> extends Response {
  data?: T
}
