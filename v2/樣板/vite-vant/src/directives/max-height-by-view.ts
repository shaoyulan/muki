import type { createApp } from 'vue';

export default {
  install(Vue: ReturnType<typeof createApp>) {
    Vue.directive('mhbv', {
      mounted(el, binding) {
        
      },
      unmounted(el) {
        
      }
    });
  }
}
