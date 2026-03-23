import axios from 'axios'

export const http = axios.create({
  headers: {
    Accept: 'application/json',
  },
})

export async function getJson<T>(path: string): Promise<T> {
  const { data } = await http.get<T>(path)
  return data
}
