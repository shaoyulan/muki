import { defineConfig } from '../define-config'
import { createCommonConfig } from './common'

export function createDevelopConfig() {
  return defineConfig({
    ...createCommonConfig(),
    env: 'develop',
  })
}
