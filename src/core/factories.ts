/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MiniFetchOptions } from '../types/MiniFetch'

import { miniFetch } from './miniFetch'

export function createMiniFetch(baseUrl?: string) {
  async function request<T = any>(url: string, options?: MiniFetchOptions) {
    const mergedUrl = baseUrl ? baseUrl + url : url
    return miniFetch<T>(mergedUrl, options)
  }

  return {
    request,
    get: <T = any>(url: string, options?: MiniFetchOptions) =>
      request<T>(url, { ...options, method: 'GET' }),
    post: <T = any>(url: string, options?: MiniFetchOptions) =>
      request<T>(url, { ...options, method: 'POST' }),
    patch: <T = any>(url: string, options?: MiniFetchOptions) =>
      request<T>(url, { ...options, method: 'PATCH' }),
    put: <T = any>(url: string, options?: MiniFetchOptions) =>
      request<T>(url, { ...options, method: 'PUT' }),
    delete: <T = any>(url: string, options?: MiniFetchOptions) =>
      request<T>(url, { ...options, method: 'DELETE' }),
  }
}
