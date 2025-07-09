import { ofetch } from 'ofetch'

export const $api = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://202.10.44.133:3001',
  credentials: 'include', // penting untuk cookie/session jika backend support
  mode: 'cors',
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      }
    }
    options.credentials = 'include'
    options.mode = 'cors'
  },
})
