import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { mockXHR } from './mock'

// 开发环境下使用 mock
if (process.env.NODE_ENV === 'development') {
  mockXHR()
}

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
