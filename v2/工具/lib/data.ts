/**
 * 轉換資料格式
 * 
 * type設置參考:
 * @see https://github.com/unjs/destr/blob/main/src/index.ts#L32
 */
export function objectKeyCamelToSnake<T>(value: any, escape?:string[]): T {

  const isPureObjectOrArray = value && (Object.prototype.toString.call(value) === '[object Object]' || Array.isArray(value))
  
  if (!isPureObjectOrArray) {
    return value
  }
  
  
  if (Array.isArray(value)) {
    return value.map(item => objectKeyCamelToSnake<T>(item)) as T
  }
  
  return Object.keys(value).reduce((acc:Record<string, unknown>, key) => {
    // ignore if key is in escape list
    if (Array.isArray(escape) && escape.includes(key)) {
      acc[key] = value[key]
      return acc
    }

    const snakeKey = key?.replace(/[A-Z]/g, match => `_${match.toLowerCase()}`)
    const content = value[key]
    acc[snakeKey] = objectKeyCamelToSnake(content)
    return acc
  }, {}) as T
}

/**
 * 轉換資料格式
 * 
 * type設置參考:
 * @see https://github.com/unjs/destr/blob/main/src/index.ts#L32
 */
export function objectKeySnakeToCamel<T = unknown> (value: any, escape?:string[]): T {
  const isPureObjectOrArray = value && (Object.prototype.toString.call(value) === '[object Object]' || Array.isArray(value))
  
  if (!isPureObjectOrArray) {
    return value
  }

  if (Array.isArray(value)) {
    return value.map(item => objectKeySnakeToCamel(item)) as T
  }

  return Object.keys(value).reduce((acc:Record<string, any>, key) => {
    // ignore if key is in escape list
    if (Array.isArray(escape) && escape.includes(key)) {
      acc[key] = value[key]
      return acc
    }

    const camelKey = key.replace(/(_\w)/g, match => match[1].toUpperCase())
    const content = value[key]
    acc[camelKey] = objectKeySnakeToCamel(content)
    return acc
  }, {}) as T
}

/**
 * 轉換字串格式
 */
export function camelToSnake(value: string): string {
  return value.replace(/[A-Z]/g, match => `_${match.toLowerCase()}`)
}

/**
 * 轉換字串格式
 */
export function snakeToCamel(value: string): string {
  return value.replace(/(_\w)/g, match => match[1].toUpperCase())
}

/**
 * 是否為純資料物件
 */
export function isPlainObject(value: any): boolean {
  return Boolean(value && Object.prototype.toString.call(value) === '[object Object]')
}

/**
 * 深拷貝
 */
export function deepCopy<T>(source: any): T {
  return JSON.parse(JSON.stringify(source))
}

/**
 * 非空陣列
 */
export function notEmptyArray(source: any): boolean {
  return Array.isArray(source) && source.length > 0
}