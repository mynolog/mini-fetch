const nonSerializableTypes = [ArrayBuffer, Blob, FormData, URLSearchParams]

export function isSerializable(body: unknown) {
  if (body === null || typeof body !== 'object') return false
  return !nonSerializableTypes.some((type) => body instanceof type)
}
