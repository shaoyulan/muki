import Emittery from 'emittery'
import type { EtEventBus, EbEvent } from './types'

/**
 * 使用Emittery 實作的 Event Bus
 */
export class EmitteryEventBus<T extends string, L extends EbEvent> implements EtEventBus<T> {
  private emittery = new Emittery()

  on<E extends T>(event: E, callback: (payload?: Extract<L, { name: E }>['payload']) => void): void {
    this.emittery.on(event, (emitteryPayload) => {
      callback(emitteryPayload)
    })
  }

  off(event: T, callback: () => void): void {
    this.emittery.off(event, callback)
  }

  emit<E extends T>(event: E, payload?: Extract<L, { name: E }>['payload']): void {
    this.emittery.emit(event, payload)
  }
}
