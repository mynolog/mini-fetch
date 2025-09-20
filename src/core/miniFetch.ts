import type { MiniFetchOptions, MiniFetchResponse } from '../types/MiniFetch'
import { HttpError, TimeoutError, FetchError } from '../errors/MiniFetchError'
import { isSerializable } from '../utils/bodySerializer'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function miniFetch<T = any>(
  url: string,
  options?: MiniFetchOptions,
): Promise<MiniFetchResponse<T>> {
  const {
    autoParseJson = true,
    timeout = 0,
    method = 'GET',
    body,
    headers,
    ...rest
  } = options || {}

  const abortController = new AbortController()
  let abortTimer: ReturnType<typeof setTimeout> | null = null
  if (timeout > 0) {
    abortTimer = setTimeout(() => abortController.abort(), timeout)
  }

  try {
    const mergedHeaders = new Headers(headers)
    let requestBody: BodyInit | undefined
    if (method !== 'GET' && body !== undefined) {
      if (isSerializable(body)) {
        requestBody = JSON.stringify(body)
        if (!mergedHeaders.has('Content-Type')) {
          mergedHeaders.set('Content-Type', 'application/json')
        }
      } else {
        requestBody = body as BodyInit
      }
    }

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

    const data = autoParseJson ? await response.json() : undefined
    const miniResponse: MiniFetchResponse<T> = Object.assign(response, { data })
    return miniResponse
  } catch (error: unknown) {
    if (!(error instanceof Error)) {
      throw error
    }
    if (error.name === 'AbortError' || error.message.includes('aborted')) {
      throw new TimeoutError(method, url, timeout)
    }
    throw new FetchError(error.message)
  } finally {
    if (abortTimer !== null) clearTimeout(abortTimer)
  }
}
