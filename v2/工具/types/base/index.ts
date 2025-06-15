export type I18nObj<T = string> = {
  [key: string]: T
}

export type Paginate = {
  current_page: number
  per_page: number
  total: number
  total_page: number
}
