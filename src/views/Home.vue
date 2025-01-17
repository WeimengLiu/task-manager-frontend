<template>
  <div class="home">
    <div class="page-header">
      <h2 class="page-title">系统概览</h2>
      <div class="refresh-settings">
        <span class="label">自动刷新：</span>
        <el-select v-model="refreshInterval" size="default" @change="handleIntervalChange">
          <el-option label="关闭" :value="0" />
          <el-option label="5秒" :value="5" />
          <el-option label="10秒" :value="10" />
          <el-option label="30秒" :value="30" />
        </el-select>
      </div>
    </div>
    
    <el-row :gutter="20" class="overview-cards">
      <el-col :span="8">
        <el-card class="overview-card">
          <div class="card-content">
            <div class="card-header">
              <el-icon class="icon" color="#409EFF"><Refresh /></el-icon>
              <span class="title">同步任务</span>
            </div>
            <div class="number">{{ statistics.syncTasks }}</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="overview-card">
          <div class="card-content">
            <div class="card-header">
              <el-icon class="icon" color="#67C23A"><VideoPlay /></el-icon>
              <span class="title">运行中</span>
            </div>
            <div class="number">{{ statistics.running }}</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="overview-card">
          <div class="card-content">
            <div class="card-header">
              <el-icon class="icon" color="#E6A23C"><Timer /></el-icon>
              <span class="title">待处理</span>
            </div>
            <div class="number">{{ statistics.pending }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Refresh, VideoPlay, Timer } from '@element-plus/icons-vue'
import { api } from '@/api'
import { ElMessage } from 'element-plus'

const statistics = ref({
  syncTasks: 0,
  running: 0,
  pending: 0
})

const refreshInterval = ref(0)  // 默认不自动刷新
let timer = null

const getStatistics = async () => {
  try {
    const res = await api.dashboard.getStatistics()
    if (res && res.data) {
      statistics.value = res.data
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('获取统计数据失败')
  }
}

const handleIntervalChange = (value) => {
  // 清除现有定时器
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  
  // 设置新的定时器
  if (value > 0) {
    timer = setInterval(getStatistics, value * 1000)
  }
}

onMounted(() => {
  getStatistics()
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped>
.home {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
  font-size: 26px;
  font-weight: 600;
  color: #1f2f3d;
}

.refresh-settings {
  display: flex;
  align-items: center;
}

.refresh-settings .label {
  margin-right: 8px;
  color: #606266;
  font-size: medium;
}

.overview-cards {
  margin-bottom: 20px;
}

.overview-card {
  transition: all 0.3s;
  height: 160px;
}

.overview-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.card-content {
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.icon {
  font-size: 24px;
  margin-right: 8px;
}

.title {
  font-size: 24px;
  color: #303133;
  font-weight: 500;
}

.number {
  font-size: 52px;
  font-weight: normal;
  line-height: 1;
  color: #303133;
  margin-top: 4px;
}

:deep(.el-card) {
  border: none;
  border-radius: 8px;
}

:deep(.el-card__body) {
  height: 100%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-select) {
  width: 100px;
}
</style> 