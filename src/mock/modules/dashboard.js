import Mock from 'mockjs'
import { successResponse } from '../utils'

export default {
  getStatistics: () => {
    return successResponse({
      syncTasks: Mock.Random.natural(2, 8),
      running: Mock.Random.natural(0, 3),
      pending: Mock.Random.natural(2, 6)
    })
  }
} 