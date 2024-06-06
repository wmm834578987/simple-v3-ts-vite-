import { createApp } from 'vue'
import './style.css'
import App from "./App.vue"
import ElementPlus from 'element-plus'
import router from './router'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
const app = createApp(App)
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router).use(ElementPlus).use(createPinia()).mount('#app')
