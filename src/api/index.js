import request from '@/utils/request'

// 示例API
export const api = {
  
  // 首页统计相关
  dashboard: {
    getStatistics() {
      return request.get('/task/statistics')
    }
  },

  // 同步任务相关
  linkTask: {
    getList() {
      return request.get('/linkTasks/list')
    },
    start(id) {
      return request.post(`/linkTasks/start/${id}`)
    },
    stop(id) {
      return request.post(`/linkTasks/stop/${id}`)
    },
    execute(id) {
      return request.post(`/linkTasks/execute/${id}`)
    },
    delete(id) {
      return request.delete(`/linkTasks/delete/${id}`)
    },
    add(data) {
      return request.post('/linkTasks/add', data)
    },
    update(data) {
      return request.post('/linkTasks/update', data)
    }
  },

  // 目录相关
  dir: {
    getDirs(path) {
      return request.get('/dir/getdirs', { params: { path } })
    }
  },

  // 远程任务相关
  remoteTask: {
    getList() {
      return request.get('/remoteTasks/list')
    },
    start(id) {
      return request.post(`/remoteTasks/start/${id}`)
    },
    stop(id) {
      return request.post(`/remoteTasks/stop/${id}`)
    },
    execute(id) {
      return request.post(`/remoteTasks/execute/${id}`)
    },
    delete(id) {
      return request.delete(`/remoteTasks/delete/${id}`)
    },
    add(data) {
      return request.post('/remoteTasks/add', data)
    },
    update(data) {
      return request.post('/remoteTasks/update', data)
    }
  }
}

export default api 