type ManaulCheckUpdateOption = {
  callback: ({ forced, timerId }: { forced: boolean, timerId: number }) => void;
  /**
   * @description 手動檢查更新需設定 interval
   * 每次間隔內只會執行一次 callback。若未達到 interval設定的間隔時間，
   * 即便多次呼叫 runTimersCheck 也不會重複執行 callback
   */
  interval: number;
}

type IntervalCheckUpdateOption = {
  callback: ({ forced, timerId }: { forced: boolean, timerId: number }) => void;
  /**
   * @description 指定固定間隔時間要執行 callback
   * 
   * 未設定此參數時將不會固定間隔時間執行 callback，
   * 請在需要檢查更新時手動呼叫 runTimersCheck
   */
  forcedInterval: number;
}

type SetIntervalOptions = ManaulCheckUpdateOption | IntervalCheckUpdateOption;

type Timer = {
  callback: ({ forced, timerId }: { forced: boolean, timerId: number }) => void;
  interval: number;
  lastExecution: number;
  forcedInterval: number;
  forcedIntervalId: number | undefined;
}
type TimberCallBack = ({ forced, timerId }: { forced?: boolean, timerId: number }) => void;
type CustomSetInterval = (options: SetIntervalOptions) => number | undefined;
type CustomClearInterval = (timerId: number) => void;

const ActivityBasedTimer = () => {
  let globalTimerId = 0;
  const timers = new Map<number, Timer>();

  const maybeExecuteTimerCallback:TimberCallBack = ({ timerId, forced = false }) => {
    const timer = timers.get(timerId);

    if (timer === undefined) {
      return;
    }

    const {
      callback,
      interval,
      forcedInterval,
      forcedIntervalId,
      lastExecution,
    } = timer;
    const intervalToCheckFor = forced === true
      ? forcedInterval
      : interval;
    const now = Date.now();

    if (now - lastExecution < intervalToCheckFor) {
      return;
    }

    const newTimer = {
      ...timer,
      lastExecution: now,
    };

    if (forcedIntervalId !== undefined) {
      window.clearInterval(forcedIntervalId);
      newTimer.forcedIntervalId = window.setInterval(() => {
        maybeExecuteTimerCallback({ timerId, forced: true });
      }, forcedInterval);
    }

    timers.set(timerId, newTimer);
    callback({ forced, timerId });
  };

  const setInterval:CustomSetInterval = (options) => {
    const isManualCheckUpdateOption = 'interval' in options;
    const callback = options.callback;
    const interval = isManualCheckUpdateOption ? options.interval : 0;
    const forcedInterval = isManualCheckUpdateOption ? undefined : options.forcedInterval
    
    const timerId = globalTimerId;

    if (typeof callback !== 'function' || typeof interval !== 'number') {
      return undefined;
    }

    const timer:Timer = {
      callback,
      interval,
      lastExecution: Date.now(),
      forcedInterval: 0,
      forcedIntervalId: undefined,
    };

    if (forcedInterval !== undefined) {
      timer.forcedInterval = forcedInterval;
      timer.forcedIntervalId = window.setInterval(() => {
        maybeExecuteTimerCallback({ timerId, forced: true });
      }, forcedInterval);
    }

    timers.set(timerId, timer);
    globalTimerId += 1;
    return timerId;
  };

  const clearInterval:CustomClearInterval = (timerId) => {
    const timer = timers.get(timerId);

    if (timer === undefined) {
      return;
    }

    const { forcedIntervalId } = timer;

    if (forcedIntervalId !== undefined) {
      window.clearInterval(forcedIntervalId);
    }

    timers.delete(timerId);
  };

  const runTimersCheck = () => {
    timers.forEach((_timer, timerId) => {
      maybeExecuteTimerCallback({ timerId });
    });
  };

  return {
    setInterval,
    clearInterval,
    runTimersCheck,
  };
};

export default ActivityBasedTimer;