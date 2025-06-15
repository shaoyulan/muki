import { defineConfig } from '../define-config'
import { createCommonConfig } from './common'

export function createReleaseConfig() {
  return defineConfig({
    ...createCommonConfig(),
    env: 'release',
  })
}
