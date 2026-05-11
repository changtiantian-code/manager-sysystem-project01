import { createApp } from 'vue';

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from "element-plus/es/locale/lang/zh-cn"
import "./style.css"




import App from './App.vue'
import router from '@/router'
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
app
.use(ElementPlus, {locale})
.use(router)
.use(pinia)
.mount('#app')
