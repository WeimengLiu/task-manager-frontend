<template>
  <div class="tasks">
    <div class="page-header">
      <h2 class="page-title">软连接同步</h2>
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
      <el-table-column prop="name" label="任务名称" min-width="120" />
      <el-table-column prop="sourceDir" label="源目录" min-width="180" show-overflow-tooltip />
      <el-table-column prop="targetDir" label="目的目录" min-width="180" show-overflow-tooltip />
      <el-table-column prop="ignoreTypes" label="忽略类型" min-width="120" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'running' ? 'success' : 'info'">
            {{ row.status === 'running' ? '运行中' : '已停止' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="cronExpr" label="Cron表达式" min-width="120" />
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" @click="handleEdit(row)" :icon="Edit" size="small">
              编辑
            </el-button>
            <el-button
              :type="row.status === 'running' ? 'danger' : 'success'"
              @click="handleToggleStatus(row)"
              size="small"
            >
              {{ row.status === 'running' ? '停止' : '启动' }}
            </el-button>
            <el-button type="warning" @click="handleExecute(row)" size="small">
              立即执行
            </el-button>
            <el-button type="danger" @click="handleDelete(row)" size="small">
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 使用任务对话框组件 -->
    <TaskDialog
      v-model:visible="dialogVisible"
      :is-edit="isEdit"
      :task-data="currentTask"
      @submit="handleDialogSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Refresh, Edit } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { api } from '@/api'
import TaskDialog from '@/components/TaskDialog.vue'

const loading = ref(false)
const taskList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentTask = ref({})

// 获取任务列表
const getTaskList = async () => {
  loading.value = true
  try {
    const res = await api.linkTask.getList()
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

// 打开新增对话框
const handleAdd = () => {
  isEdit.value = false
  currentTask.value = {}
  dialogVisible.value = true
}

// 打开编辑对话框
const handleEdit = (row) => {
  isEdit.value = true
  currentTask.value = { ...row }
  dialogVisible.value = true
}

// 处理对话框提交
const handleDialogSubmit = async (formData) => {
  try {
    if (isEdit.value) {
      await api.linkTask.update(formData)
      ElMessage.success('更新成功')
    } else {
      await api.linkTask.add(formData)
      ElMessage.success('添加成功')
    }
    getTaskList()
  } catch (error) {
    console.error(error)
    ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
  }
}

// 启动/停止任务
const handleToggleStatus = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.status === 'running' ? '停止' : '启动'}该任务吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    if (row.status === 'running') {
      await api.linkTask.stop(row.id)
    } else {
      await api.linkTask.start(row.id)
    }
    
    ElMessage.success(`${row.status === 'running' ? '停止' : '启动'}成功`)
    await getTaskList()
  } catch (error) {
    console.error(error)
    ElMessage.error('操作失败')
  }
}

// 立即执行
const handleExecute = async (row) => {
  try {
    await ElMessageBox.confirm('确定要立即执行该任务吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    
    await api.linkTask.execute(row.id)
    ElMessage.success('执行成功')
  } catch (error) {
    console.error(error)
    ElMessage.error('执行失败')
  }
}

// 删除任务
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该任务吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    
    await api.linkTask.delete(row.id)
    ElMessage.success('删除成功')
    await getTaskList()
  } catch (error) {
    console.error(error)
    ElMessage.error('删除失败')
  }
}

onMounted(() => {
  getTaskList()
})
</script>

<style scoped>
.tasks {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style> 