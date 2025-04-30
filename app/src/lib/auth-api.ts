import { useToken } from '@/store/use-token'
import axios from 'axios'
import api from './api'
import { config } from './config'

const authApi = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

authApi.interceptors.request.use(config => {
  const { accessToken } = useToken.getState()
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

authApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest.sent) {
      originalRequest.sent = true
      originalRequest._retry = true

      try {
        const res = await api.post('/auth/refresh')
        const { accessToken } = res.data
        useToken.setState({ accessToken })
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return authApi(originalRequest)
      } catch (err) {
        useToken.setState({ accessToken: null })
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default authApi
