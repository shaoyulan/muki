import { defineConfig } from '../define-config'
import { createCommonConfig } from './common'

export function createLocalConfig() {
  return defineConfig({
    ...createCommonConfig(),
    env: 'local',
  })
}
