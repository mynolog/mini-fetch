import type { MiniFetchOptions } from '../types/MiniFetch'
import { HttpError, TimeoutError, FetchError } from '../errors/MiniFetchError'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function miniFetch<T = any>(url: string, options?: MiniFetchOptions): Promise<T> {
  const {
    autoParseJson = true,
    timeout = 5000,
    method = 'GET',
    body,
    headers,
    ...rest
  } = options || {}

  const abortController = new AbortController()
  const abortTimer: ReturnType<typeof setTimeout> = setTimeout(
    () => abortController.abort(),
    timeout,
  )
  try {
    const mergedHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...(headers || {}),
    }
    const requestBody = method !== 'GET' ? JSON.stringify(body) : undefined

    const response = await fetch(url, {
      method,
      headers: mergedHeaders,
      body: requestBody,
      signal: abortController.signal,
      ...rest,
    })

    if (!response.ok) {
      throw new HttpError(method, url, response.status)
    }

    return autoParseJson ? ((await response.json()) as T) : (response as unknown as T)
  } catch (error: unknown) {
    if (!(error instanceof Error)) {
      throw error
    }
    if (error.name === 'AbortError') {
      throw new TimeoutError(method, url, timeout)
    }
    throw new FetchError(error.message)
  } finally {
    clearTimeout(abortTimer)
  }
}
