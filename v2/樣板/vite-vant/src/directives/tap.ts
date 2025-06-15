// v-tap.ts
import type { createApp } from 'vue';
import { DirectiveBinding } from 'vue';

interface TapBinding extends DirectiveBinding {
  value: {
    singleTap?: (event: MouseEvent) => void;
    doubleTap?: (event: MouseEvent) => void;
    longPress?: (event: MouseEvent) => void;
  };
}

const vTap = {
  mounted(el: HTMLElement, binding: TapBinding) {
    let clickTimer: NodeJS.Timeout | null = null;
    let longPressTimer: NodeJS.Timeout | null = null;
    let lastTapTime = 0;

    const handleClick = (event: MouseEvent) => {
      const currentTime = Date.now();
      const timeSinceLastTap = currentTime - lastTapTime;

      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }

      if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
        binding.value.doubleTap && binding.value.doubleTap(event);
      } else {
        clickTimer = setTimeout(() => {
          clickTimer = null;
          binding.value.singleTap && binding.value.singleTap(event);
        }, 300);
      }

      lastTapTime = currentTime;
    };

    const handleLongPress = (event: MouseEvent | TouchEvent) => {
      longPressTimer = setTimeout(() => {
        longPressTimer = null;
        binding.value.longPress && binding.value.longPress(event);
      }, 300);
    };

    const handleRelease = () => {
      if (clickTimer) clearTimeout(clickTimer);
      if (longPressTimer) clearTimeout(longPressTimer);
      clickTimer = null;
      longPressTimer = null;
    };

    // 使用 click, mousedown, touchstart 等事件
    el.addEventListener('click', handleClick);
    el.addEventListener('mousedown', handleLongPress);
    el.addEventListener('touchstart', handleLongPress);
    el.addEventListener('mouseup', handleRelease);
    el.addEventListener('touchend', handleRelease);
    el.addEventListener('mouseleave', handleRelease);
    el.addEventListener('touchcancel', handleRelease);

    el._tapHandlers = { handleClick, handleLongPress, handleRelease };
  },
  unmounted(el: HTMLElement) {
    const { handleClick, handleLongPress, handleRelease } = el._tapHandlers;
    el.removeEventListener('click', handleClick);
    el.removeEventListener('mousedown', handleLongPress);
    el.removeEventListener('touchstart', handleLongPress);
    el.removeEventListener('mouseup', handleRelease);
    el.removeEventListener('touchend', handleRelease);
    el.removeEventListener('mouseleave', handleRelease);
    el.removeEventListener('touchcancel', handleRelease);
    delete el._tapHandlers;
  }
};

export default {
  install(Vue: ReturnType<typeof createApp>) {
    Vue.directive('tap', vTap);
  }
}
