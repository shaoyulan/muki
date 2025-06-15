import { defineStore } from 'pinia'
import i18n from '@/locales'

const { locale } = i18n.global

export const useStore = defineStore('store', {
  state: () => ({
    isLogin: false,
  }),
  getters: {
  },
  actions: {
  },
  persist: {
  },
})
