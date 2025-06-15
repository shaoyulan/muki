<template>
  <div style="display: none;">
    app updator
  </div>
</template>
<script setup lang="ts">
import AppUpdator from '@/tools/lib/app-updater'

if(!import.meta.env.SSR){
  const router = useRouter()
  
  const updator = AppUpdator.init({
    async promptUserUpdate() {
      // const dDialog = useDialog()
      // await dDialog.fire({
      //   showCloseIcon: false,
      //   icon: 'warning',
      //   title: '發現新版本',
      //   text: '按下確認後將刷新App',
      // })
      /**
       * @description 傳入true的方式僅為作為支援app webview內的reload
       * 本App內更更動後皆有對資源做hash處理，因此單純的location.reload即可支援一般瀏覽器
       */
      // @ts-expect-error 支援所有app環境
      location.reload(true)
    },
  })
  
  router.beforeEach((_to, _from, next) => {
    updator.runTimersCheck()
    next()
  })
}
</script>
