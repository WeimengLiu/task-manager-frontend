import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 5000
})

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 200) {
      return res
    }
    return Promise.reject(new Error(res.message || 'Error'))
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

export default request 