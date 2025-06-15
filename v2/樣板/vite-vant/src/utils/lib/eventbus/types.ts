/**
 * Event bus 規範介面
 */
export interface EtEventBus<T = string, P = unknown> {
  on(event: T, callback: (payload?: P) => void): void
  off(event: T, callback: () => void): void
  emit(event: T, payload?: P): void
}

/**
 * Event bus 事件型別
 * @example
 * ```ts
 * EbEvent<'放事件名稱', {
 *  // 事件資料內容
    nickname: string,
    id: number
  }>
  ```
 * ```ts
 * EbEvent<'放事件名稱', boolean>
    payload 可自訂不一定要傳 object，也可傳 boolean ... etc
  ```
 */
export type EbEvent<T = string, P = unknown> = {
  /** 事件名稱 */
  name: T
  /** 事件資料 */
  payload: P
}
