import Mock from 'mockjs'
import dashboard from './modules/dashboard'
import linkTask from './modules/linkTask'
import remoteTask from './modules/remoteTask'

export function mockXHR() {
  Mock.setup({
    timeout: '200-600'
  })

  // 仪表盘相关
  Mock.mock(/\/api\/task\/statistics/, 'get', dashboard.getStatistics)

  // 软链接任务相关
  Mock.mock(/\/api\/linkTasks\/list/, 'get', linkTask.getList)
  Mock.mock(/\/api\/linkTasks\/start\/\d+/, 'post', linkTask.start)
  Mock.mock(/\/api\/linkTasks\/stop\/\d+/, 'post', linkTask.stop)
  Mock.mock(/\/api\/linkTasks\/execute\/\d+/, 'post', linkTask.execute)
  Mock.mock(/\/api\/linkTasks\/delete\/\d+/, 'delete', linkTask.delete)
  Mock.mock(/\/api\/linkTasks\/add/, 'post', linkTask.add)
  Mock.mock(/\/api\/linkTasks\/update/, 'post', linkTask.update)

  // 远程任务相关
  Mock.mock(/\/api\/remoteTasks\/list/, 'get', remoteTask.getList)
  Mock.mock(/\/api\/remoteTasks\/add/, 'post', remoteTask.add)
  Mock.mock(/\/api\/remoteTasks\/update/, 'post', remoteTask.update)
  Mock.mock(/\/api\/remoteTasks\/delete\/\d+/, 'delete', remoteTask.delete)
  Mock.mock(/\/api\/remoteTasks\/execute\/\d+/, 'post', remoteTask.execute)
  Mock.mock(/\/api\/remoteTasks\/start\/\d+/, 'post', remoteTask.start)
  Mock.mock(/\/api\/remoteTasks\/stop\/\d+/, 'post', remoteTask.stop)

  // 目录相关
  Mock.mock(/\/api\/dir\/getdirs/, 'get', linkTask.getDirs)
}

export default {
  mockXHR
} 