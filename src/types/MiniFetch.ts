/* eslint-disable @typescript-eslint/no-explicit-any */
export type MiniFetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface MiniFetchOptions<B = any> extends Omit<RequestInit, 'body' | 'method'> {
  body?: B
  method?: MiniFetchMethod
  autoParseJson?: boolean
  timeout?: number
}

export type MiniFetchApi = {
  get: <T = any>(url: string, options?: MiniFetchOptions) => Promise<T>
  post: <T = any>(url: string, options?: MiniFetchOptions) => Promise<T>
  put: <T = any>(url: string, options?: MiniFetchOptions) => Promise<T>
  delete: <T = any>(url: string, options?: MiniFetchOptions) => Promise<T>
}
