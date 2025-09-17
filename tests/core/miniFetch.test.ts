import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { miniFetch } from '../../src/core/miniFetch'
import { TimeoutError } from '../../src/errors/MiniFetchError'

interface FakeResponse {
  message: string
}

describe('miniFetch', () => {
  beforeEach(() => {
    vi.useFakeTimers() // fake timer 활성화
  })

  afterEach(() => {
    vi.useRealTimers() // fake timer 비활성화
  })
  // 성공 응답 검증
  it('should return data on successful response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ message: 'hello' }),
      text: async () => 'hello',
    } as Response)

    const response = await miniFetch<FakeResponse>('https://fake-url.com/')
    expect(response.data?.message).toBe('hello')
    expect(response.ok).toBe(true)
    expect(response.status).toBe(200)
  })
  // autoParseJson 옵션 false일 때 data가 undefined인지 검증
  it('should return undefined data when autoParse is false', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ message: 'hello' }),
      text: async () => 'hello',
    } as Response)

    const response = await miniFetch<FakeResponse>('https://fake-url.com/', {
      autoParseJson: false,
    })
    expect(response.data).toBeUndefined()
    expect(response.ok).toBe(true)
    expect(response.status).toBe(200)
  })
  // timeout 발생 시 TimeoutError가 throw 되는지 검증
  it('should reject with TimeoutError when request times out', async () => {
    globalThis.fetch = vi.fn().mockImplementation(
      (_url, { signal }) =>
        new Promise((_resolve, reject) => {
          signal?.addEventListener('abort', () => {
            reject(new TimeoutError('GET', _url, 1000))
          })
        }),
    )

    const fetchPromise = miniFetch<FakeResponse>('https://fake-url.com/', {
      timeout: 1000,
    })

    vi.advanceTimersByTime(1000)

    await expect(fetchPromise).rejects.toThrow(/Request timed out/i)
  })
  // HTTP 에러 발생 시 HttpError가 throw 되는지 검증
  it('should reject with HttpError on HTTP error response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
    } as Response)

    await expect(miniFetch<FakeResponse>('https://fake-url.com/')).rejects.toThrow(
      /Request failed with Http/i,
    )
  })
})
