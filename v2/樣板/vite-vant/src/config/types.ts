export type AppConfig = {
  /**
   * local: 本地
   * develop: 測試環境
   * release: 正式環境
   */
  env: 'local' | 'develop' | 'release'
  apiURL: string
}
