import Mock from 'mockjs'

// 通用响应格式
export const successResponse = (data) => {
  return {
    code: 200,
    message: 'success',
    data
  }
}

// 提取URL中的ID
export const getIdFromUrl = (url, pattern) => {
  const match = url.match(pattern)
  return match ? Number(match[1]) : null
}

// 解析请求体
export const parseRequestBody = (body) => {
  return typeof body === 'string' ? JSON.parse(body) : body
} 