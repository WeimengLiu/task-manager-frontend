# Task Manager Frontend

一个基于 Vue 3 的任务管理前端，用于管理和自动化文件同步任务。通过创建软链接，实现文件的自动同步。

## 功能特性

- 🔄 软链接同步任务管理（创建/编辑/删除）
- ⏱️ 支持 Cron 表达式的定时执行
- 📂 可视化目录选择器
- 🚫 文件类型过滤（支持多选和自定义）
- 📊 任务状态监控和统计
- ⚡ 支持手动触发执行

## 开发环境

- Node.js >= 16
- Vue 3.5
- Vite 6.0

## 主要依赖

- Element Plus 2.5.6
- Vue 3.5.13
- Vue Router 4.2.5
- Pinia 2.1.7
- MockJS 1.1.0
- Vue3CronPlusPicker 1.0.2
- Monaco Editor 0.52.2
## 安装依赖

```bash
npm install
```

## 启动开发环境

```bash
npm run dev
```

## 打包

```bash
npm run build
```

## 项目结构

```
src/
├── api/
├── components/
├── store/
├── views/
├── App.vue
├── main.js
├── router.js
├── vite.config.js
```

## 使用说明
### 任务管理
- 创建任务：点击"新增任务"按钮，填写任务信息
- 编辑任务：点击任务列表中的"编辑"按钮
- 删除任务：点击任务列表中的"删除"按钮

### 任务配置
- 源目录：使用目录选择器选择源文件目录
- 目标目录：使用目录选择器选择目标目录
- 忽略类型：可选择或自定义要忽略的文件类型
- 定时规则：使用 Cron 表达式生成器配置执行时间

### 任务操作
- 启动/停止：控制任务的运行状态
- 立即执行：手动触发任务执行
- 查看状态：监控任务的运行状态和执行时间

## 开发指南

### 添加新接口
在 `api/index.js` 中添加新的接口定义：

```javascript
export const getTasks = () => {
  return request({
    url: '/api/tasks',
    method: 'GET'
  })
}
```

### 添加新页面
在 `src/views/` 目录下创建新的 Vue 组件文件，并在 `router.js` 中添加路由配置。

```javascript
import TaskList from '@/views/TaskList.vue'

const routes = [
  { path: '/tasks', component: TaskList }
]
```

### 添加新组件
在 `src/components/` 目录下创建新的 Vue 组件文件，并在需要使用的地方引入。

```javascript
import TaskDialog from '@/components/TaskDialog.vue'
```

