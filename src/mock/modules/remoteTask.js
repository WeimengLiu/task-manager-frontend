import Mock from 'mockjs'
import { successResponse, getIdFromUrl, parseRequestBody } from '../utils'

export default {
  getList: () => {
    return successResponse([
      {
        id: 1,
        host: '192.168.1.100',
        username: 'admin',
        password: '******',
        script: '#!/bin/bash\necho "Hello World"\ndate\nls -la',
        status: 'running',
        cronExpr: '0 0/30 * * * ?',
        lastExecuteTime: Mock.Random.datetime(),
        nextExecuteTime: Mock.Random.datetime()
      },
      {
        id: 2,
        host: '192.168.1.101',
        username: 'root',
        password: '******',
        script: '#!/bin/bash\ndf -h\nfree -m\ntop -b -n 1',
        status: 'stopped',
        cronExpr: '0 0 0/1 * * ?',
        lastExecuteTime: Mock.Random.datetime(),
        nextExecuteTime: null
      },
      {
        id: 3,
        host: '192.168.1.102',
        username: 'deploy',
        password: '******',
        script: '#!/bin/bash\ncd /app\n./deploy.sh\necho "Deploy completed"',
        status: 'running',
        cronExpr: '0 0 0/2 * * ?',
        lastExecuteTime: Mock.Random.datetime(),
        nextExecuteTime: Mock.Random.datetime()
      }
    ])
  },

  add: ({ body }) => {
    const data = parseRequestBody(body)
    return successResponse({
      ...data,
      id: Mock.Random.id(),
      status: 'stopped',
      lastExecuteTime: null,
      nextExecuteTime: null
    })
  },

  update: ({ body }) => {
    const data = parseRequestBody(body)
    return successResponse({
      ...data,
      lastExecuteTime: Mock.Random.datetime(),
      nextExecuteTime: data.status === 'running' ? Mock.Random.datetime() : null
    })
  },

  delete: ({ url }) => {
    const id = getIdFromUrl(url, /\/remoteTasks\/delete\/(\d+)/)
    return successResponse({ id })
  },

  execute: ({ url }) => {
    const id = getIdFromUrl(url, /\/remoteTasks\/execute\/(\d+)/)
    return successResponse({
      id,
      executeTime: Mock.Random.datetime(),
      status: 'success',
      output: Mock.Random.paragraph()
    })
  },

  start: ({ url }) => {
    const id = getIdFromUrl(url, /\/remoteTasks\/start\/(\d+)/)
    return successResponse({
      id,
      status: 'running',
      nextExecuteTime: Mock.Random.datetime()
    })
  },

  stop: ({ url }) => {
    const id = getIdFromUrl(url, /\/remoteTasks\/stop\/(\d+)/)
    return successResponse({
      id,
      status: 'stopped',
      nextExecuteTime: null
    })
  }
} 