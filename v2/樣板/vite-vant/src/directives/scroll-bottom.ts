import type { createApp } from 'vue';
import { debounce } from 'lodash-es';

const onScroll = (el: HTMLElement, binding: any) => {
  const { scrollTop, scrollHeight, clientHeight } = el;
  if (scrollTop + clientHeight >= scrollHeight) {
    binding.value(); // Call the provided callback
  }
}


export default {
  install(Vue: ReturnType<typeof createApp>) {
    Vue.directive('scroll-bottom', {
      mounted(el, binding) {
        const isDebounce = binding?.arg === 'debounce';
        const scrollFunc = isDebounce ? debounce(onScroll, 300) : onScroll;

        el.addEventListener('scroll', () => scrollFunc(el, binding));

        // Store the scroll event handler on the element for cleanup
        el.__onScroll = scrollFunc;
      },
      unmounted(el) {
        // Clean up the scroll event listener
        el.removeEventListener('scroll', el.__onScroll);
        delete el.__onScroll;
      }
    });
  }
}
