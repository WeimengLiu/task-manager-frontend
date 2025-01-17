import Mock from 'mockjs'
import { successResponse, getIdFromUrl, parseRequestBody } from '../utils'

export default {
  getList: () => {
    return successResponse([
      {
        id: 1,
        name: '文档同步',
        sourceDir: '/data/source/docs',
        targetDir: '/data/target/docs',
        ignoreTypes: '.tmp,.log',
        status: 'running',
        cronExpr: '0 0/30 * * * ?',
        lastExecuteTime: Mock.Random.datetime(),
        nextExecuteTime: Mock.Random.datetime()
      },
      {
        id: 2,
        name: '配置同步',
        sourceDir: '/data/source/config',
        targetDir: '/data/target/config',
        ignoreTypes: '.bak',
        status: 'stopped',
        cronExpr: '0 0 0/1 * * ?',
        lastExecuteTime: Mock.Random.datetime(),
        nextExecuteTime: null
      },
      {
        id: 3,
        name: '日志同步',
        sourceDir: '/data/source/logs',
        targetDir: '/data/target/logs',
        ignoreTypes: '.tmp',
        status: 'running',
        cronExpr: '0 0/15 * * * ?',
        lastExecuteTime: Mock.Random.datetime(),
        nextExecuteTime: Mock.Random.datetime()
      }
    ])
  },

  start: ({ url }) => {
    const id = getIdFromUrl(url, /\/linkTasks\/start\/(\d+)/)
    return successResponse({
      id,
      status: 'running',
      nextExecuteTime: Mock.Random.datetime()
    })
  },

  stop: ({ url }) => {
    const id = getIdFromUrl(url, /\/linkTasks\/stop\/(\d+)/)
    return successResponse({
      id,
      status: 'stopped',
      nextExecuteTime: null
    })
  },

  execute: ({ url }) => {
    const id = getIdFromUrl(url, /\/linkTasks\/execute\/(\d+)/)
    return successResponse({
      id,
      executeTime: Mock.Random.datetime(),
      status: 'success'
    })
  },

  delete: ({ url }) => {
    const id = getIdFromUrl(url, /\/linkTasks\/delete\/(\d+)/)
    return successResponse({ id })
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

  getDirs: ({ url }) => {
    const params = new URLSearchParams(url.split('?')[1])
    const path = params.get('path')
    
    // 根目录
    if (!path) {
      return successResponse([
        {
          path: '/data',
          name: 'data',
          type: 'dir'
        },
        {
          path: '/usr',
          name: 'usr',
          type: 'dir'
        },
        {
          path: '/opt',
          name: 'opt',
          type: 'dir'
        }
      ])
    }
    
    // 模拟子目录
    if (path === '/data') {
      return successResponse([
        {
          path: '/data/logs',
          name: 'logs',
          type: 'dir'
        },
        {
          path: '/data/config',
          name: 'config',
          type: 'dir'
        },
        {
          path: '/data/www',
          name: 'www',
          type: 'dir'
        }
      ])
    }
    
    if (path === '/data/logs') {
      return successResponse([
        {
          path: '/data/logs/app',
          name: 'app',
          type: 'dir'
        },
        {
          path: '/data/logs/system',
          name: 'system',
          type: 'dir'
        }
      ])
    }
    
    // 其他目录默认返回空列表
    return successResponse([])
  }
} 