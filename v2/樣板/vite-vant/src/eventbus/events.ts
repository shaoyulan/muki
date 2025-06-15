import type { EbEvent } from '@/utils/lib/eventbus/types'

/**
 * 事件列表
 * @description 請在這裡定義所有的事件
 */
export type EventList =
  // 範例
  EbEvent<'example', null> |
  // 顯示編輯暱稱燈箱
  EbEvent<'showNicknameEditDialog', {
    checkTimeInterval: boolean
  }>
  

export type EventNames = EventList['name']
