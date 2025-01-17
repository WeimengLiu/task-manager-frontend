<template>
  <div class="cron-editor">
    <el-input
      v-model="cronValue"
      placeholder="请输入或使用生成器生成Cron表达式"
      :readonly="readonly"
      :clearable="true"
      @click="openDialog"
    >
      <template #append>
        <el-button @click="openDialog">
          <el-icon class="icon"><Clock /></el-icon>
          生成器
        </el-button>
      </template>
    </el-input>

    <el-dialog
      v-model="showDialog"
      title="Cron表达式生成器"
      width="800px"
      :close-on-click-modal="false"
    >
      <Vue3CronPlusPicker
        @hide="closeDialog"
        @fill="fillValue"
        :expression="expression"
      />
    </el-dialog>
  </div>
</template>

<script>
import { Clock } from '@element-plus/icons-vue'
import 'vue3-cron-plus-picker/style.css'
import { Vue3CronPlusPicker } from 'vue3-cron-plus-picker'

export default {
  name: 'CronEditor',
  components: {
    Vue3CronPlusPicker,
    Clock
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cronValue: this.modelValue,
      showDialog: false,
      expression: '* * * * * * *'
    }
  },
  watch: {
    modelValue(val) {
      this.cronValue = val
    },
    cronValue(val) {
      this.$emit('update:modelValue', val)
    }
  },
  methods: {
    openDialog() {
      this.showDialog = true
      if (this.cronValue) {
        this.expression = this.cronValue
      }
    },
    closeDialog() {
      this.showDialog = false
    },
    fillValue(value) {
      this.cronValue = value
    }
  }
}
</script>

<style scoped>
.cron-editor {
  width: 100%;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

/* 调整组件样式 */
:deep(.popup-result) {
  word-break: break-all;
}

:deep(.el-tabs__nav) {
  margin-left: 20px;
}

:deep(.popup-main) {
  min-height: 360px;
  padding: 0;
}

:deep(.el-input-group__append) {
  padding: 0;
}

:deep(.el-input-group__append .el-button) {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 16px;
  min-width: 120px;
  justify-content: center;
  gap: 6px;
}

.icon {
  margin-right: 0;
}
</style> 