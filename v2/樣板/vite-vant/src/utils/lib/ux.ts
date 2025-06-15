import { createHead, useHead } from 'unhead'
import { ref } from 'vue'

createHead()

const linkList = ref<MetaLinkItem[]>([])

type MetaLinkItem = {
  rel: string
  href: string
}

type UserMetaLinkItem = {
  href: string
}

function isItemExist(item: MetaLinkItem) {
  return linkList.value.some((link) => link.href === item.href)
}

export function createPreloadLink(items: UserMetaLinkItem[]) {
  if(Array.isArray(items)) {
    items.forEach((item) => {
      const newItem = {
        ...item,
        rel: 'preload',
      }
      if(isItemExist(newItem)) return
      useHead({
        link: [newItem]
      })
      linkList.value.push(newItem)
    })
  }
}
