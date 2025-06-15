<template>
  <div style="display: none;">seo</div>
</template>
<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import { 
  useSchemaOrg, 
  defineWebSite, 
  defineWebPage, 
  definePerson, 
  defineOrganization,
  defineImage,
  defineArticle,
  defineSoftwareApp,
  defineBreadcrumb 
} from '@unhead/schema-org/vue'
import config from '@/config'

const BrandName = config.seo?.name || ''
const description = config.seo?.description || ''
const websiteUrl = ''
const route = useRoute()

useSeoMeta({
  title: ()=> route.meta?.seoTitle || BrandName,
  keywords: () => {
    const content = route.meta?.seoKeywords || config.seo?.keywords || ''
    const reuslt = content as string
    return reuslt 
  },
  description: () => {
    const content = route.meta?.seoDescription || description
    const reuslt = content as string
    return reuslt
  },
  ogDescription: () => {
    const content = route.meta?.seoDescription || description 
    const reuslt = content as string
    return reuslt
  },
  ogType: 'website',
  ogTitle: ()=> {
    const content = route.meta?.seoTitle || BrandName 
    const reuslt = content as string
    return reuslt
  },
  ogUrl: ()=> websiteUrl,
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineOrganization({
    name: BrandName,
    image: '/assets/images/seo/seo-image.jpg',
    logo: '/assets/images/logo/logo@3x.png',
    sameAs: [
      // '放社群網站連結',
      websiteUrl,
    ],
    primaryImageOfPage: '/assets/images/logo/logo@3x.png', 
  }),
  definePerson({
    name: BrandName,
    image: '/assets/images/logo/logo@3x.png',
    sameAs: [
      // '放社群網站連結',
      websiteUrl,
    ],
  }),
  defineWebSite({
    name: BrandName,
    type: 'WebSite',
    inLanguage: 'zh-TW',
    description: ()=> {
      const content = route.meta?.seoTitle || BrandName
      const reuslt = content as string
      return reuslt
    },
  }),
  defineWebPage({
    image: '/assets/images/logo/logo@3x.png',
  }),
  defineImage({
    caption: BrandName,
    contentUrl:'/assets/images/seo/seo-image.jpg',
    width: 1080,
    height: 1920,
  }),
  defineArticle({
    headline: () => {
      const content = route.meta?.seoTitle || BrandName
      const reuslt = content as string
      return reuslt
    },
    description: ()=> {
      const content =route.meta?.seoDescription || description
      const reuslt = content as string
      return reuslt
    },
    image: '/assets/images/logo/logo@3x.png'
  }),
  defineSoftwareApp({
    name: BrandName,
    operatingSystem: 'ANDROID, IOS',
    applicationCategory: 'GameApplication',
    aggregateRating: {
      ratingValue: '4.8',
      ratingCount: '4000',
    },
    offers: {
      price: '0',
      priceCurrency: 'TWD',
    },
  }),
  defineBreadcrumb({
    itemListElement: [
      {
        name: BrandName,
      },
      {
        name: route?.meta?.name || ''
      }
    ]
  })
])
</script>
