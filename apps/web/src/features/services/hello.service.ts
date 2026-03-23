import { getJson } from '@/shared/api/http'
import { helloResponseSchema } from '@/features/types/hello'

export function fetchHello() {
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'
  return getJson(`${apiBaseUrl}/api/hello`).then((payload) =>
    helloResponseSchema.parse(payload),
  )
}
