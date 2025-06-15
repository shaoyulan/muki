
type FormatNumberOptions = {
  /** 小數位數 */
  decimalPlaces?: number
  /**　是否round進位 */
  round?: boolean
  /** 是否無條件捨去 */
  floor?: boolean
  /**是否無條件進位　 */
  ceil?: boolean
  /** 是否補零 */
  padZero?: boolean
  /** 是否加千分位 */
  thousands?: boolean
}

/**
 * 數值格式化
 * 
 * 使用時請注意:
 * 2. 有round進位需求時，若總位數超過16位，建議改用專用套件計算後再傳入本function format(ex: Decimal.js等套件)
 * 3. 沒有round需求時，可直接使用本function作為數值格式化用途
 */
export function formatNumber(input, options:FormatNumberOptions = {}) {
  const { 
    decimalPlaces = 0, 
    round = false, 
    floor = false,
    ceil = false,
    padZero = false, 
    thousands = false 
  } = options

  const fallBackToRound = !round && !floor && !ceil
  const parsed = parseFloat(input)
  const value = isNaN(parsed) ? 0 : parsed

  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('Invalid number input')
  }
  if (typeof decimalPlaces !== 'number' || decimalPlaces < 0) {
    throw new Error('Invalid decimal places input')
  }

  // 無條件捨去或四捨五入
  const factor = Math.pow(10, decimalPlaces)
  const factoredValue = parseFloat(
    /**
     * 處理數字精度問題
     * 請注意: 本方式僅適用小數點前位數+小數點後位數(decimalPlaces)不超過16位時
     */
    (value * factor).toFixed(decimalPlaces)
  )
  let processedValue = value  / factor

  if(round || fallBackToRound) {
    processedValue = Math.round(factoredValue) / factor
  } else if (floor) {
    processedValue = Math.floor(factoredValue) / factor
  } else if (ceil) {
    processedValue = Math.ceil(factoredValue) / factor
  }

  // 轉換成字串，並補零
  let formattedValue = processedValue.toString()
  if (padZero) {
    const dotIndex = formattedValue.indexOf('.')
    if (dotIndex === -1) {
      formattedValue += '.'
      formattedValue += '0'.repeat(decimalPlaces)
    } else {
      const currentDecimals = formattedValue.length - dotIndex - 1
      const zerosToAdd = decimalPlaces - currentDecimals
      if (zerosToAdd > 0) {
        formattedValue += '0'.repeat(zerosToAdd)
      }
    }
  }

  // 處理千分位
  if (thousands) {
    const [integerPart, decimalPart] = formattedValue.split('.')
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    formattedValue = decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger
  }

  return formattedValue
}