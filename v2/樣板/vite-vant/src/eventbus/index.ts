import type { EventNames, EventList } from './events'
import { EmitteryEventBus } from '@/utils/lib/eventbus/emittery-eventbus'

export const eventBus = new EmitteryEventBus<EventNames, EventList>()
