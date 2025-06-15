<template>
  <div 
    class="page p-maintenance" 
    ref="refAppPage"
  >
    <div class="sp-page">
      <h1 class="sp-page__title">
        404<br>
        找不到此頁面!!
      </h1>
      <div class="sp-page__p">
        <div class="sp-page__line-block">
          對不起，我們無法找到你所要求的頁面。也許它已經被移除，或者你輸入了錯誤的網址。請返回主頁看看是否有你需要的資訊。
        </div>
      </div>
      <div class="sp-page__deco">
        <img src="@/assets/images/pages/maintenance/deco.png" alt="" srcset="">
      </div>
      <ContactCsBar
      showBackHomeButton
      />
    </div>
  </div>
</template>
<script setup lang="ts">

</script>
<style scoped>
@import 'Index.scss';
</style>