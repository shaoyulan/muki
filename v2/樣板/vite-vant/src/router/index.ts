import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from '@/store/index'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  },
  routes: setupLayouts(routes),
})

router.beforeEach((to, from, next) => {
  const store = useStore()
  if (!store.isLogin && to.meta.requiresAuth && to.path !== '/login') {
    return next('/login')
  }
  next()
})

router.afterEach((to) => {
  if('function' === typeof window.gtag) {
    window.gtag('event', 'page_view', {
      page_location: to.path,
    })
  }
})

/**
 * @see https://uvr.esm.is/introduction.html#migrating-an-existing-project
 */
if (import.meta.hot) { 
  handleHotUpdate(router) 
} 

export default router
