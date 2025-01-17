<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    :title="isEdit ? '编辑任务' : '新增任务'"
    width="600px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入任务名称" />
      </el-form-item>
      
      <el-form-item label="源目录" prop="sourceDir">
        <el-input
          v-model="form.sourceDir"
          placeholder="请选择源目录路径"
        >
          <template #append>
            <el-button @click="handleSelectDir('source')">
              <el-icon><Folder /></el-icon>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      
      <el-form-item label="目的目录" prop="targetDir">
        <el-input
          v-model="form.targetDir"
          placeholder="请选择目的目录路径"
        >
          <template #append>
            <el-button @click="handleSelectDir('target')">
              <el-icon><Folder /></el-icon>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      
      <el-form-item label="忽略类型" prop="ignoreTypes">
        <el-select
          v-model="ignoreTypeList"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请输入要忽略的文件类型"
          @change="handleIgnoreTypesChange"
        >
          <el-option
            v-for="item in commonIgnoreTypes"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="Cron表达式" prop="cronExpr">
        <CronEditor v-model="form.cronExpr" />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  
  <!-- 目录选择对话框 -->
  <el-dialog
    v-model="dirDialogVisible"
    :title="`选择${currentDirType === 'source' ? '源' : '目的'}目录`"
    width="500px"
  >
    <!-- 添加面包屑导航 -->
    <div class="dir-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item 
          class="clickable"
          @click="handleBreadcrumbClick(-1)"
        >
          根目录
        </el-breadcrumb-item>
        <el-breadcrumb-item 
          v-for="(item, index) in currentPath" 
          :key="index"
          :class="{ clickable: index < currentPath.length - 1 }"
          @click="handleBreadcrumbClick(index)"
        >
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <el-table
      v-loading="dirLoading"
      :data="dirList"
      style="width: 100%"
      @row-dblclick="handleDirSelect"
      @row-click="handleDirClick"
      highlight-current-row
    >
      <el-table-column width="50">
        <template #default="{ row }">
          <el-icon><Folder /></el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="目录名" />
      <el-table-column prop="path" label="路径" show-overflow-tooltip />
    </el-table>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dirDialogVisible = false">取消</el-button>
        <el-button 
          type="primary" 
          @click="handleDirConfirm"
          :disabled="!selectedDir"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Folder } from '@element-plus/icons-vue'
import CronEditor from './CronEditor.vue'
import { api } from '@/api'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  taskData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'submit'])

const formRef = ref(null)
const submitting = ref(false)

const form = ref({
  id: undefined,
  name: '',
  sourceDir: '',
  targetDir: '',
  ignoreTypes: '',
  cronExpr: ''
})

const rules = {
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  sourceDir: [{ required: true, message: '请输入源目录路径', trigger: 'blur' }],
  targetDir: [{ required: true, message: '请输入目的目录路径', trigger: 'blur' }],
  cronExpr: [{ required: true, message: '请输入Cron表达式', trigger: 'blur' }]
}

const ignoreTypeList = ref([])
const commonIgnoreTypes = ['.tmp', '.log', '.bak', '.swp', '.temp']

// 将逗号分隔的字符串转换为数组
const initIgnoreTypes = (types) => {
  if (types) {
    ignoreTypeList.value = types.split(',').filter(Boolean)
  } else {
    ignoreTypeList.value = []
  }
}

// 监听 taskData 变化时初始化忽略类型
watch(() => props.taskData, (newVal) => {
  if (newVal && Object.keys(newVal).length > 0) {
    form.value = { ...newVal }
    initIgnoreTypes(newVal.ignoreTypes)
  }
}, { deep: true })

// 处理忽略类型变化
const handleIgnoreTypesChange = (val) => {
  form.value.ignoreTypes = val.join(',')
}

const dirDialogVisible = ref(false)
const currentDirType = ref('')
const dirList = ref([])
const dirLoading = ref(false)
const currentPath = ref([])
const selectedDir = ref(null)

// 获取目录列表
const getDirList = async (path) => {
  dirLoading.value = true
  try {
    const res = await api.dir.getDirs(path)
    if (res && res.data) {
      dirList.value = res.data
    }
  } catch (error) {
    console.error('获取目录列表失败:', error)
    ElMessage.error('获取目录列表失败')
  } finally {
    dirLoading.value = false
  }
}

// 处理目录选择按钮点击
const handleSelectDir = async (type) => {
  currentDirType.value = type
  currentPath.value = []
  selectedDir.value = null
  await getDirList()
  dirDialogVisible.value = true
}

// 处理目录点击
const handleDirClick = (row) => {
  selectedDir.value = row
}

// 处理目录双击
const handleDirSelect = async (row) => {
  currentPath.value.push(row)
  await getDirList(row.path)
}

// 处理面包屑点击
const handleBreadcrumbClick = async (index) => {
  if (index === -1) {
    // 点击根目录
    currentPath.value = []
    await getDirList()
  } else if (index < currentPath.value.length - 1) {
    const path = currentPath.value[index].path
    currentPath.value = currentPath.value.slice(0, index + 1)
    await getDirList(path)
  }
}

// 处理目录确认选择
const handleDirConfirm = () => {
  if (selectedDir.value) {
    if (currentDirType.value === 'source') {
      form.value.sourceDir = selectedDir.value.path
    } else {
      form.value.targetDir = selectedDir.value.path
    }
    dirDialogVisible.value = false
  }
}

// 重置表单
const resetForm = () => {
  form.value = {
    id: undefined,
    name: '',
    sourceDir: '',
    targetDir: '',
    ignoreTypes: '',
    cronExpr: ''
  }
  ignoreTypeList.value = []
  formRef.value?.resetFields()
}

// 关闭对话框
const handleClose = () => {
  emit('update:visible', false)
  resetForm()
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    emit('submit', { ...form.value })
    handleClose()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-table) {
  --el-table-header-bg-color: var(--el-fill-color-light);
}

:deep(.el-table__row) {
  cursor: pointer;
}

:deep(.el-table__row:hover) {
  background-color: var(--el-fill-color-lighter) !important;
}

.dir-breadcrumb {
  margin-bottom: 16px;
  padding: 8px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.clickable {
  cursor: pointer;
  color: var(--el-color-primary);
}

:deep(.el-breadcrumb__item:last-child) {
  color: var(--el-text-color-regular);
}

.dir-breadcrumb + .el-table :deep(.el-table__row) {
  user-select: none;
}
</style> 