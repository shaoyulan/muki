import fs from 'fs'
const modeMap = {
  develop: 'develop',
  development: 'develop',
  release: 'release',
  production: 'release'
} as Record<string, string>
const isClient = typeof window !== 'undefined';
const isProcessExist = typeof process === 'undefined' ? false : true;
const isImportMetaExist = typeof import.meta === 'undefined' ? false : true;
const safeProcess = isProcessExist ? process : {} as NodeJS.Process
const processEnv = safeProcess?.env || {}
const processArgv = safeProcess?.argv || []
const importMetaEnv = isImportMetaExist ? import.meta.env : {} as ImportMetaEnv
const npmLifeCycleEvent = processEnv?.npm_lifecycle_event || ''
const cliArgs = processArgv?.slice(2) || ''
const cliMode = (function(){
  const cliModePoistion = cliArgs.indexOf('--mode')
  const isCliModeExist = cliModePoistion > -1
  const cliModeValue = isCliModeExist ? cliArgs?.[cliModePoistion + 1] : ''

  // 使用傳入的 --mode 參數
  if(cliModeValue) {
    return cliModeValue
  }

  // 使用者沒有指定 --mode 參數
  // 使用前端慣例來設定預設mode
  if(processEnv.NODE_ENV){
    if(modeMap?.[processEnv.NODE_ENV]) {
      return modeMap?.[processEnv.NODE_ENV]
    }
  }
  
  console.warn('未指定 --mode 參數，且 NODE_ENV 也未設定')

  return ''
}());
const importMetaMode = (function(){
  const mode = importMetaEnv?.MODE

  if(mode){
    if(modeMap?.[mode]){
      return modeMap?.[mode]
    }
  }

  console.warn('import.meta.env.MODE 不存在')

  return ''
}())


/**
 * 依據當前環境判斷 mode，如都未設定則使用 develop作為預設
 */
const modeValue = isProcessExist ? cliMode : importMetaMode
const envValue = isProcessExist ? processEnv : importMetaEnv

if(!modeValue){
  console.warn('mode 未設定，將使用 develop 作為預設', isProcessExist)
}

export {
  isClient
}

export const mode = modeValue || 'develop'

const isEnvFileExist = fs.existsSync('../../.env')
const envFileContent = isEnvFileExist ? fs.readFileSync('../../.env', 'utf8') : ''

export const env = envValue || {} as (NodeJS.Process | ImportMetaEnv)

console.log(`===cli mode===: ${cliMode}`)
console.log(`===importMeta mode===: ${importMetaMode || '-'}`)
console.log(`===mode===: ${mode}`)

console.log(`===mode===: ${process.env.VITE_BRAND_NAME}`)
