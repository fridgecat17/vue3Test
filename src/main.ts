import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 注册指令
import plugins from './plugins' // plugins
import { download } from '@/utils/request'
const app = createApp(App)

// 全局方法挂载
app.config.globalProperties.download = download

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(plugins)
app.mount('#app')
