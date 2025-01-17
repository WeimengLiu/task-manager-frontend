import Mock from 'mockjs'

export function mockXHR() {
  // 设置响应延时
  Mock.setup({
    timeout: '200-600'
  })

  // 首页统计数据接口
  Mock.mock(/\/api\/task\/statistics/, 'get', () => {
    console.log('Mock: 调用统计接口')  // 添加日志
    return {
      code: 200,
      message: 'success',
      data: {
        syncTasks: Mock.Random.natural(2, 8),
        running: Mock.Random.natural(0, 3),
        pending: Mock.Random.natural(2, 6)
      }
    }
  })

  // 同步任务列表接口
  Mock.mock(/\/api\/linkTasks\/list/, 'get', () => {
    console.log('Mock: 调用任务列表接口')  // 添加日志
    return {
      code: 200,
      message: 'success',
      data: [
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
      ]
    }
  })

  // 启动任务
  Mock.mock(/\/api\/linkTasks\/start\/\d+/, 'post', ({ url }) => {
    const id = url.match(/\/api\/linkTasks\/start\/(\d+)/)[1]
    return {
      code: 200,
      message: 'success',
      data: {
        id: Number(id),
        status: 'running',
        nextExecuteTime: Mock.Random.datetime()
      }
    }
  })

  // 停止任务
  Mock.mock(/\/api\/linkTasks\/stop\/\d+/, 'post', ({ url }) => {
    const id = url.match(/\/api\/linkTasks\/stop\/(\d+)/)[1]
    return {
      code: 200,
      message: 'success',
      data: {
        id: Number(id),
        status: 'stopped',
        nextExecuteTime: null
      }
    }
  })

  // 立即执行
  Mock.mock(/\/api\/linkTasks\/execute\/\d+/, 'post', ({ url }) => {
    const id = url.match(/\/api\/linkTasks\/execute\/(\d+)/)[1]
    return {
      code: 200,
      message: 'success',
      data: {
        id: Number(id),
        executeTime: Mock.Random.datetime(),
        status: 'success'
      }
    }
  })

  // 删除任务
  Mock.mock(/\/api\/linkTasks\/delete\/\d+/, 'delete', ({ url }) => {
    const id = url.match(/\/api\/linkTasks\/delete\/(\d+)/)[1]
    return {
      code: 200,
      message: 'success',
      data: {
        id: Number(id)
      }
    }
  })

  // 添加任务
  Mock.mock(/\/api\/linkTasks\/add/, 'post', ({ body }) => {
    const data = JSON.parse(body)
    return {
      code: 200,
      message: 'success',
      data: {
        ...data,
        id: Mock.Random.id(),
        status: 'stopped',
        lastExecuteTime: null,
        nextExecuteTime: null
      }
    }
  })

  // 更新任务
  Mock.mock(/\/api\/linkTasks\/update/, 'post', ({ body }) => {
    const data = JSON.parse(body)
    return {
      code: 200,
      message: 'success',
      data: {
        ...data,
        lastExecuteTime: Mock.Random.datetime(),
        nextExecuteTime: data.status === 'running' ? Mock.Random.datetime() : null
      }
    }
  })

  // 获取目录列表
  Mock.mock(/\/api\/dir\/getdirs/, 'get', ({ url }) => {
    const params = new URLSearchParams(url.split('?')[1])
    const path = params.get('path')
    
    // 根目录
    if (!path) {
      return {
        code: 200,
        message: 'success',
        data: [
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
        ]
      }
    }
    
    // 模拟子目录
    if (path === '/data') {
      return {
        code: 200,
        message: 'success',
        data: [
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
        ]
      }
    }
    
    if (path === '/data/logs') {
      return {
        code: 200,
        message: 'success',
        data: [
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
        ]
      }
    }
    
    // 其他目录默认返回空列表
    return {
      code: 200,
      message: 'success',
      data: []
    }
  })
}

export default {
  mockXHR
} 