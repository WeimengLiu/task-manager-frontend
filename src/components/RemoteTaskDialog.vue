<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    :title="isEdit ? '编辑任务' : '新增任务'"
    width="700px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="地址" prop="host">
        <el-input v-model="form.host" placeholder="请输入远程主机地址" />
      </el-form-item>
      
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>
      
      <el-form-item label="执行脚本" prop="script">
        <MonacoEditor
          v-model="form.script"
          language="shell"
          :height="200"
          theme="vs-dark"
        />
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
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import CronEditor from './CronEditor.vue'
import MonacoEditor from '@/components/MonacoEditor.vue'

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
  host: '',
  username: '',
  password: '',
  script: '',
  cronExpr: ''
})

const rules = {
  host: [{ required: true, message: '请输入远程主机地址', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  script: [{ required: true, message: '请输入执行脚本', trigger: 'blur' }],
  cronExpr: [{ required: true, message: '请输入Cron表达式', trigger: 'blur' }]
}

// 监听 taskData 变化
watch(() => props.taskData, (newVal) => {
  if (newVal && Object.keys(newVal).length > 0) {
    form.value = { ...newVal }
  }
}, { deep: true })

// 重置表单
const resetForm = () => {
  form.value = {
    id: undefined,
    host: '',
    username: '',
    password: '',
    script: '',
    cronExpr: ''
  }
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
</style> 