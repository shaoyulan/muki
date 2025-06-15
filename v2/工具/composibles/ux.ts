import { ref } from 'vue'

/**
 * 使用者體驗相關的工具
 */
type WaitingQueueItem = {
  timestamp: number
  resolved: boolean
}

export function useStableWaiting(minWaitTime: number = 800, maxWaitTime: number = 10000) {
  let timestamp = Date.now()
  let waiting = ref(false)
  let resolvedTimeout: NodeJS.Timeout | null = null
  let maxWaitCheckTimeout: NodeJS.Timeout | null = null

  function add(){
    if (resolvedTimeout) clearTimeout(resolvedTimeout)
    if (maxWaitCheckTimeout) clearTimeout(maxWaitCheckTimeout)
    waiting.value = true
    maxWaitCheckTimeout = setTimeout(() => {
      if (waiting.value) resetStatus()
    }, maxWaitTime)
  }

  function resolve(){
    if (timestamp + minWaitTime > Date.now()) {
      resolvedTimeout = setTimeout(() => {
        resetStatus()
      }, (timestamp + minWaitTime) - Date.now())
    } else {
      resetStatus()
    }
  }

  function resetStatus(){
    timestamp = Date.now()
    waiting.value = false
    resolvedTimeout = null
    maxWaitCheckTimeout = null
  }

  return {
    waiting,
    add,
    resolve,
    resetStatus
  }
}

export class waitingQueue {
  /** miniseconds */
  private minWaitTime: number = 0
  private maxWaitTime: number = 0
  private queue: WaitingQueueItem[] = []

  constructor(minWaitTime: number, maxWaitTime: number) {
    this.minWaitTime = minWaitTime
    this.maxWaitTime = maxWaitTime
  }
  

}