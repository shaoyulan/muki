import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import '@unocss/reset/tailwind-compat.css'
import Vant, { Locale } from 'vant'
import 'vant/lib/index.css'
import i18n from './locales'
import '@/assets/sass/main.scss'
import 'uno.css'
import 'virtual:svg-icons-register'
import VueLazyLoad from 'vue3-lazyload'
import loadingImage from './assets/images/preset/spinner.svg'
import errorImage from './assets/images/preset/empty.png'
import scrollBottom from '@/directives/scroll-bottom'
import vTap from '@/directives/tap'
import zhTW from 'vant/es/locale/lang/zh-TW'
import router from '@/router'

Locale.use('zh-TW', zhTW)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

scrollBottom.install(app)
vTap.install(app)

app.use(router)
app.use(VueLazyLoad, {
  error: errorImage,
  loading: loadingImage,
})
app.use(Vant)
app.use(pinia)
app.use(i18n)
app.mount('#app')


