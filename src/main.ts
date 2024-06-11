import { createApp } from 'vue'
import './style.css'
import App from "./App.vue"
import ElementPlus from 'element-plus'
import router from './router'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
const app = createApp(App)
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router).use(ElementPlus, {
    locale: zhCn,
}).use(createPinia()).mount('#app')
