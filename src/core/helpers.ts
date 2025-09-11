/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MiniFetchApi, MiniFetchOptions } from '../types/MiniFetch'

import { miniFetch } from './miniFetch'

export const miniFetchApi: MiniFetchApi = {
  get: <T = any>(url: string, options?: MiniFetchOptions) =>
    miniFetch<T>(url, { ...options, method: 'GET' }),
  post: <T = any>(url: string, options?: MiniFetchOptions) =>
    miniFetch<T>(url, { ...options, method: 'POST' }),
  patch: <T = any>(url: string, options?: MiniFetchOptions) =>
    miniFetch<T>(url, { ...options, method: 'PATCH' }),
  put: <T = any>(url: string, options?: MiniFetchOptions) =>
    miniFetch<T>(url, { ...options, method: 'PUT' }),
  delete: <T = any>(url: string, options?: MiniFetchOptions) =>
    miniFetch<T>(url, { ...options, method: 'DELETE' }),
}
