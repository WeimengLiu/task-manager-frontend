<template>
  <div class="remote-tasks">
    <div class="page-header">
      <h2 class="page-title">远程任务</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增任务
        </el-button>
        <el-button @click="refreshList">
          <el-icon><Refresh /></el-icon>刷新
        </el-button>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="taskList"
      style="width: 100%"
      border
    >
      <el-table-column 
        prop="host" 
        label="地址" 
        min-width="200"
        show-overflow-tooltip 
      />
      <el-table-column 
        prop="username" 
        label="用户" 
        min-width="120"
        show-overflow-tooltip 
      />
      <el-table-column 
        prop="password" 
        label="密码" 
        min-width="120"
        show-overflow-tooltip
      >
        <template #default>
          <span>******</span>
        </template>
      </el-table-column>
      <el-table-column 
        prop="cronExpr" 
        label="Cron表达式" 
        min-width="200"
        show-overflow-tooltip 
      />
      <el-table-column 
        prop="status" 
        label="状态" 
        min-width="100"
        align="center"
      >
        <template #default="{ row }">
          <el-tag :type="row.status === 'running' ? 'success' : 'info'">
            {{ row.status === 'running' ? '运行中' : '已停止' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column 
        label="操作" 
        width="260"
        fixed="right"
        align="center"
      >
        <template #default="{ row }">
          <el-button-group>
            <el-button
              :type="row.status === 'running' ? 'danger' : 'success'"
              size="small"
              @click="handleStatusChange(row)"
            >
              {{ row.status === 'running' ? '停止' : '启动' }}
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="handleExecute(row)"
              :disabled="row.status !== 'running'"
            >
              执行
            </el-button>
            <el-button
              type="primary"
              size="small"
              plain
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              plain
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 任务对话框 -->
    <RemoteTaskDialog
      v-model:visible="dialogVisible"
      :is-edit="isEdit"
      :task-data="currentTask"
      @submit="handleDialogSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'
import { api } from '@/api'
import RemoteTaskDialog from '@/components/RemoteTaskDialog.vue'

const loading = ref(false)
const taskList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentTask = ref({})

// 获取任务列表
const getTaskList = async () => {
  loading.value = true
  try {
    const res = await api.remoteTask.getList()
    if (res && res.data) {
      taskList.value = res.data
    }
  } catch (error) {
    console.error('获取任务列表失败:', error)
    ElMessage.error('获取任务列表失败')
  } finally {
    loading.value = false
  }
}

// 刷新列表
const refreshList = () => {
  getTaskList()
}

// 新增任务
const handleAdd = () => {
  isEdit.value = false
  currentTask.value = {}
  dialogVisible.value = true
}

// 编辑任务
const handleEdit = (row) => {
  isEdit.value = true
  currentTask.value = { ...row }
  dialogVisible.value = true
}

// 删除任务
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该任务吗？', '提示', {
      type: 'warning'
    })
    await api.remoteTask.delete(row.id)
    ElMessage.success('删除成功')
    getTaskList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除任务失败:', error)
      ElMessage.error('删除任务失败')
    }
  }
}

// 执行任务
const handleExecute = async (row) => {
  try {
    await api.remoteTask.execute(row.id)
    ElMessage.success('执行成功')
    getTaskList()
  } catch (error) {
    console.error('执行任务失败:', error)
    ElMessage.error('执行任务失败')
  }
}

// 改变任务状态
const handleStatusChange = async (row) => {
  try {
    if (row.status === 'running') {
      await api.remoteTask.stop(row.id)
      ElMessage.success('停止成功')
    } else {
      await api.remoteTask.start(row.id)
      ElMessage.success('启动成功')
    }
    getTaskList()
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  }
}

// 处理对话框提交
const handleDialogSubmit = async (data) => {
  try {
    if (isEdit.value) {
      await api.remoteTask.update(data)
      ElMessage.success('更新成功')
    } else {
      await api.remoteTask.add(data)
      ElMessage.success('添加成功')
    }
    getTaskList()
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  }
}

onMounted(() => {
  getTaskList()
})
</script>

<style scoped>
.remote-tasks {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 12px;
}

:deep(.el-button-group) {
  display: flex;
  gap: 4px;
}

:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}
</style> 