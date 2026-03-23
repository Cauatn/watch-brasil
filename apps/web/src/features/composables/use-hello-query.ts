import { useQuery } from '@tanstack/vue-query'
import { fetchHello } from '@/features/services/hello.service'

export function useHelloQuery() {
  return useQuery({
    queryKey: ['hello'],
    queryFn: fetchHello,
  })
}
