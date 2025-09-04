import type { MiniFetchMethod } from '../types/MiniFetch'

export class HttpError extends Error {
  constructor(
    public method: MiniFetchMethod,
    public url: string,
    public status: number,
    public response?: Response,
  ) {
    super(`Request failed with HTTP ${status}: ${method} ${url}`)
    this.name = 'HttpError'
  }
}

export class TimeoutError extends Error {
  constructor(
    public method: MiniFetchMethod,
    public url: string,
    public timeout: number,
  ) {
    super(`Request timed out after ${timeout}ms: ${method} ${url}`)
    this.name = 'TimeoutError'
  }
}

export class FetchError extends Error {
  constructor(message: string) {
    super(`Request failed with Fetch Error: ${message}`)
    this.name = 'FetchError'
  }
}
