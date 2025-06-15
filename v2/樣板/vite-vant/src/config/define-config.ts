import type { AppConfig } from './types'

export function defineConfig<T = AppConfig>(config: T): T {
  return {
    ...config,
  }
}
