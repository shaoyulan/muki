import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

const config = [
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      parserOptions: {
        /** 
         * 讓 eslint-plugin-vue 的parser能夠正確解析有使用 TypeScript 的 .vue 檔案
         * @see https://eslint.vuejs.org/user-guide/#how-to-use-a-custom-parser
         */
        parser: '@typescript-eslint/parser'
      }
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars' : 'off',
      'vue/no-multiple-template-root': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
    },
  },
]

export default config
