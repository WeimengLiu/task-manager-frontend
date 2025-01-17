<script setup>
import { ref } from 'vue'
import { HomeFilled, Connection, Fold, Expand, Document } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const isCollapse = ref(false)
const route = useRoute()
</script>

<template>
  <el-container class="app-wrapper">
    <el-header class="header">
      <div class="header-left">
        <div class="header-title">
          <img src="/icon.svg" class="logo-icon" alt="logo" />
          <h2>任务管理系统</h2>
        </div>
        <div class="header-decoration">
          <span class="dot"></span>
          <span class="line"></span>
          <span class="version">V1.0</span>
        </div>
      </div>
    </el-header>
    
    <el-container class="main-container">
      <el-aside :width="isCollapse ? '64px' : '200px'" class="aside-menu">
        <div class="menu-header">
          <el-button 
            link
            class="collapse-btn"
            @click="isCollapse = !isCollapse"
          >
            <el-icon><Fold v-if="!isCollapse" /><Expand v-else /></el-icon>
          </el-button>
        </div>
        <el-menu
          :router="true"
          class="side-menu"
          default-active="/"
          :collapse="isCollapse"
        >
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/tasks">
            <el-icon><Connection /></el-icon>
            <span>软连接同步</span>
          </el-menu-item>
          <el-menu-item index="/remote-tasks">
            <el-icon><Document /></el-icon>
            <span>远程任务</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <el-main class="main-content">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
/* 全局字体设置 */
:root {
  --font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", 
    "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", 
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

html {
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  color: #303133;
}

/* 统一标题字重 */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
}

/* 覆盖 Element Plus 的默认字体和字重 */
:deep(.el-button),
:deep(.el-input__inner),
:deep(.el-select),
:deep(.el-dropdown),
:deep(.el-menu-item),
:deep(.el-submenu__title) {
  font-family: var(--font-family);
  font-weight: 500;
}

/* 全局样式 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app {
  height: 100%;
}
</style>

<style scoped>
.app-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #fff;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  border-bottom: 1px solid #ebeef5;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  font-size: large;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  width: 26px;
  height: 26px;
  animation: pulse 2s infinite;
}

.header-decoration {
  display: flex;
  align-items: center;
  margin-left: 16px;
  gap: 8px;
}

.dot {
  width: 6px;
  height: 6px;
  background-color: #409EFF;
  border-radius: 50%;
}

.line {
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, #409EFF 0%, transparent 100%);
}

.version {
  font-size: 12px;
  color: #909399;
  font-weight: 500;
}

.main-container {
  flex: 1;
  min-height: 0;
}

.aside-menu {
  transition: width 0.3s;
  background-color: #fff;
  border-right: 1px solid #ebeef5;
  height: 100%;
  overflow-x: hidden;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.side-menu {
  flex: 1;
  border-right: none;
  overflow-y: auto;
}

.side-menu:not(.el-menu--collapse) {
  width: 200px;
}

.main-content {
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f7fa;
  height: 100%;
}

.el-menu-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: all 0.3s;
  font-size: 14px;
  letter-spacing: 0.3px;
  font-weight: 500;
  padding: 0 20px !important;
}

.el-menu-item:hover {
  background-color: #f5f7fa !important;
  transform: translateX(5px);
}

.el-menu-item.is-active {
  background-color: #ecf5ff !important;
  color: #409EFF !important;
  border-right: 2px solid #409EFF;
}

.el-menu-item .el-icon {
  margin-right: 12px;
  font-size: 18px;
}

.menu-header {
  height: 50px;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  border-bottom: 1px solid #ebeef5;
}

.collapse-btn {
  padding: 0;
  width: 20px;
  height: 20px;
  font-size: 20px;
  color: #606266;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapse-btn:hover {
  color: #409EFF;
  transform: scale(1.1);
}

/* 收缩状态下的样式 */
.el-menu--collapse .el-menu-item {
  padding: 0 !important;
  justify-content: center;
}

.el-menu--collapse .el-menu-item .el-icon {
  margin: 0;
}
</style>
