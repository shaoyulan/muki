<template>
  <van-tabbar
    v-model="active"
  >
    <van-tabbar-item>
      <span>首頁</span>
      <template #icon="props">
        <img
          :src="props.active ? icon.home.active : icon.home.inactive"
          alt="首頁"
        >
      </template>
    </van-tabbar-item>
    <van-tabbar-item>
      <span>搜尋</span>
      <template #icon="props">
        <img
          :src="props.active ? icon.member.active : icon.member.inactive"
          alt="搜尋"
        >
      </template>
    </van-tabbar-item>
    <van-tabbar-item badge="3">
      <span>會員中心</span>
      <template #icon="props">
        <img
          :src="props.active ? icon.member.active : icon.member.inactive"
          alt="會員中心"
        >
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>
<script setup lang="ts">

const active = ref(0)
const icon = {
  home: {
    active: 'https://fastly.jsdelivr.net/npm/@vant/assets/user-active.png',
    inactive: 'https://fastly.jsdelivr.net/npm/@vant/assets/user-inactive.png',
  },
  member: {
    active: 'https://fastly.jsdelivr.net/npm/@vant/assets/user-active.png',
    inactive: 'https://fastly.jsdelivr.net/npm/@vant/assets/user-inactive.png',
  }
}

</script>
<style scoped lang="scss"></style>