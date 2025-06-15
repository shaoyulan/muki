import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import UnoCSS from 'unocss/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { createHtmlPlugin } from 'vite-plugin-html'
import { HttpsProxyAgent } from 'https-proxy-agent'
import Sitemap from 'vite-plugin-sitemap'
import { resolve } from 'path'
import Layouts from 'vite-plugin-vue-layouts'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'

const BUILD_VERSION_TAG = new Date().toISOString()

export default (({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())}

  return defineConfig({
    esbuild: mode === 'release' ? {
      drop: ['console', 'debugger'],
    } : {},
    define: {
      '__BUILD_VERSION_TAG__': JSON.stringify(BUILD_VERSION_TAG)
    },
    build: {
      rollupOptions: {
        output: {
        },
        input: {
          main: resolve(__dirname, 'index.html')
        },
      }
    },
    server: {
      proxy: {
        '/api': {
          target: mode === 'demo' ? 'https://example.com/api' : 'https://example.com/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          agent: process.env.VITE_PROXY_AGENT_URL ? new HttpsProxyAgent(process.env.VITE_PROXY_AGENT_URL) : ''
        }
      }
    },
    preview: {
      proxy: {
        '/api': {
          target: mode === 'demo' ? 'https://example.com/api' : 'https://example.com/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
        '@': `${path.resolve(__dirname, 'src')}/`,
        '@design': `${path.resolve(__dirname, 'src/assets/sass/utils/_design.scss')}/`,
      },
    },
    plugins: [
      Sitemap({ hostname: process.env.VITE_HOST }),
      createHtmlPlugin({
        pages:[
          {
            filename: 'index.html',
            template: 'index.html',
            injectOptions: {
              data: {
                mode: mode,
                brandName: process.env.VITE_BRAND_NAME,
              },
              tags: [
                {
                  tag: 'meta',
                  attrs: {
                    name: 'version',
                    content: BUILD_VERSION_TAG,
                  },
                },
              ],
            },
          }
        ]
      }),
      VueRouter({
        extendRoute(route){
          const routeName = route.name.toLowerCase()
          if(routeName === '/index'){
            route.addAlias('/')
          }
        },
        exclude: [
          // exclude all folders named 'partial'
          '**/partial/**',
        ]
      }),
      vue(),
      UnoCSS(),
      Layouts({
        layoutsDirs: 'src/layouts',
      }),
      AutoImport({
        imports: [
          'vue',
          'vue-i18n',
          '@vueuse/core',
          VueRouterAutoImports,
          {
            'dayjs': [
              ['default', '$dayjs']
            ],
            '@/eventbus': [
              ['eventBus', 'eventBus']
            ],
          }
        ],
        dts: 'src/types/generated/auto-imports.d.ts',
        dirs: [
          'src/composables',
          'src/store',
        ],
        vueTemplate: true,
        resolvers: [VantResolver()],
      }),
  
      // https://github.com/antfu/unplugin-vue-components
      Components({
        directoryAsNamespace: true,
        dirs: ['src/components/layout', 'src/components/common', 'src/components/others'],
        // allow auto load markdown components under `./src/components/`
        extensions: ['vue', 'md'],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: 'src/types/generated/components.d.ts',
        resolvers: [VantResolver()],
      }),
  
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/images/icon')],
        symbolId: 'icon-[dir]-[name]',
      }),
  
      ViteImageOptimizer({
        /* pass your config */
      }),
    ],
  })
})
