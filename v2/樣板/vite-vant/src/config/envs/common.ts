import { defineConfig } from '../define-config'
import type { AppConfig } from '../types'

export function createCommonConfig() {
  return defineConfig<Partial<AppConfig>>({
    seo:{
      name: '',
      keywords: '',
      description: '',
    },
  })
}
