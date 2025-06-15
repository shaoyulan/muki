import ActivityBasedTimer from './activity-based-timer'

type PromptUserInfo = {
  versionNumber?: string;
}

type InitOptions = {
  /** 提示使用者更新 */
  promptUserUpdate: (info?: PromptUserInfo) => void;
}

let currentHtml = ''
const fetchHtml = async () => {
  const newHtml = await fetch('/index.html').then(res=>res.text())
  return newHtml
}
const CheckIsNewVersionAvailable = async ()=>{
  const newHtml = await fetchHtml()
  if(!currentHtml) return false
  return newHtml !== currentHtml
}

const init = (options: InitOptions) => {
  const versioningTimer = ActivityBasedTimer()
  fetchHtml().then(newHtml => {
    currentHtml = newHtml
    versioningTimer.setInterval({
      async callback() {
        console.log('Checking for new version...')
        const isNewVersionAvailable = await CheckIsNewVersionAvailable()
        if(isNewVersionAvailable){
          if(typeof options.promptUserUpdate === 'function'){
            options.promptUserUpdate()
          }
        }
      },
      // 最小檢查間隔
      interval: 1000,
    })
  })
  return versioningTimer
}

export default {
  init
}