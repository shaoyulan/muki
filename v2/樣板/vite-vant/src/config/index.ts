import { createLocalConfig } from './envs/local'
import { createDevelopConfig } from './envs/develop'
import { createReleaseConfig } from './envs/release'

/**
 * 把框架的環境變數轉換成公司慣用的自訂環境變數
 */
const mode = import.meta.env.MODE === 'production' ? 'release' : import.meta.env.MODE === 'development' ? 'develop' : import.meta.env.MODE
const env = mode || 'release'

console.log('===當前環境===:', import.meta.env.MODE, env)

export default getConfig()

function getConfig() {
  switch (env) {
    case 'release':
      return createReleaseConfig()
    case 'develop':
      return createDevelopConfig()
    case 'local':
      return createLocalConfig()
    default:
      throw new Error(`Invalid APP_ENV "${import.meta.env.MODE}"`)
  }
}
