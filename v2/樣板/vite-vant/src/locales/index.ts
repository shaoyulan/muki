import cn from "./cn.json"
import tw from "./tw.json"
import { createI18n } from "vue-i18n" // @see https://github.com/intlify/vue-i18n-next/pull/1388

const messages = {
  cn: {
    ...cn,
  },
  tw: {
    ...tw,
  },
}

let i18n = createI18n({
  // 使用 Composition API 模式，则需要将其设置为false
  legacy: false, // 默认是true的
  // 全局注入 $t 函数
  globalInjection: true, // 默认 9.1版本后是true
  locale: "tw",
  messages,
  fallbackLocale: "tw", // 没有英文的时候默认中文语言
})

export default i18n