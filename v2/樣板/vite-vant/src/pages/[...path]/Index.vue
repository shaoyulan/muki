<template>
  <div 
    class="page sp-page" 
    ref="refAppPage"
  >
    <div class="text-center">
      <h1 class="sp-page__title">
        404<br>
        找不到此頁面!!
      </h1>
    </div>
    <div class="sp-page__p">
      <div class="sp-page__line-block">
        對不起，我們無法找到你所要求的頁面。也許它已經被移除，或者你輸入了錯誤的網址。請返回主頁看看是否有你需要的資訊。
      </div>
    </div>
    <div class="sp-page__deco">
      <img style="max-width: calc(338 / 430 * 100%); margin: auto;" src="@/assets/images/pages/404/404.png" alt="" srcset="">
    </div>
    <ContactCsBar/>
  </div>
</template>
<script setup lang="ts">

</script>
<style scoped>
@import 'Index.scss';
</style>