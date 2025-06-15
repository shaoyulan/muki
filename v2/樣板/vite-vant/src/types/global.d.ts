/// <reference types="unplugin-vue-router/client" />

interface Window {
  _paq: {
    push: (args: unknown[]) => void
  }
  gtag: (event: string, payload1: unknown, payload2: unknown) => void
}

/** 
 * @description APP編譯版本號 
 * 
 * 可於vite.config.ts中透過define設定
 * 
*/
declare const __BUILD_VERSION_TAG__: string

