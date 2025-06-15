/**
 * @description 為通用(沒有特別分類)工具的存放
 * - 這裡的工具函式為通用性的，不屬於個別專案。個別專案的工具函式請放tools/index.ts
 */

/**
 * 取得網址參數最後一個路徑
 * @param {*} url 
 * @returns {string} 
 */
export function getUrlLastPath(url) {
  const urlSplit = url.split('/');
  return urlSplit[urlSplit.length - 1];
}

export function deviceDetect() {
  const userAgent = navigator.userAgent;
  if (userAgent.match(/Android/i)) {
    return "Android";
  } else if (userAgent.match(/iPhone|iPad|iPod/i)) {
    return "iOS";
  } else {
    return "Web";
  }
}

/**
 * 取得root CSS變數
 * @param {string} name 
 * @returns {string}
 * @example
 * ```ts
 * const color = getHtmlRootCssVars("--color-primary");
 * // 或也可以省略 -- 前綴
 * const color = getHtmlRootCssVars("color-primary");
 * ```
 */
export function getHtmlRootCssVars(name) {
  // 沒有 -- 前綴的話，自動加上
  const nameChecked = name.startsWith("--") ? name : `--${name}`;
  const root = document.querySelector("html");
  const styles = getComputedStyle(root);
  return styles.getPropertyValue(nameChecked);
}

export function setHtmlRootCssVars(name, value) {
  const root = document.querySelector("html");
  root.style.setProperty(name, value);
}

/**
 * 使用時請注意:
 * 2. 有round進位需求時，若總位數超過16位，建議改用專用套件計算後再傳入本function format(ex: Decimal.js等套件)
 * 3. 沒有round需求時，可直接使用本function作為數值格式化用途
 * @param {number | string} input 
 * @param {object} options 
 * @param {number=} options.decimalPlaces 小數位數
 * @param {boolean=} options.round 是否round進位
 * @param {boolean=} options.floor 是否無條件捨去
 * @param {boolean=} options.ceil 是否無條件進位
 * @param {boolean=} options.padZero 是否補零
 * @param {boolean=} options.thousands 是否加千分位
 * @returns string
 */
export function formatNumber(input, options = {}) {
  const { 
    decimalPlaces = 0, 
    round = false, 
    floor = false,
    ceil = false,
    padZero = false, 
    thousands = false 
  } = options;

  const parsed = parseFloat(input);
  const value = isNaN(parsed) ? 0 : parsed;

  if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('Invalid number input');
  }
  if (typeof decimalPlaces !== 'number' || decimalPlaces < 0) {
      throw new Error('Invalid decimal places input');
  }

  // 無條件捨去或四捨五入
  const factor = Math.pow(10, decimalPlaces);
  const factoredValue = parseFloat(
    /**
     * 處理數字精度問題
     * 請注意: 本方式僅適用小數點前位數+小數點後位數(decimalPlaces)不超過16位時
     */
    (value * factor).toFixed(decimalPlaces)
  );
  let processedValue = value  / factor;

  if(round){
    processedValue = Math.round(factoredValue) / factor;
  } else if (floor) {
    processedValue = Math.floor(factoredValue) / factor;
  } else if (ceil) {
    processedValue = Math.ceil(factoredValue) / factor;
  }

  // 轉換成字串，並補零
  let formattedValue = processedValue.toString();
  if (padZero) {
      const dotIndex = formattedValue.indexOf('.');
      if (dotIndex === -1) {
          formattedValue += '.';
          formattedValue += '0'.repeat(decimalPlaces);
      } else {
          const currentDecimals = formattedValue.length - dotIndex - 1;
          const zerosToAdd = decimalPlaces - currentDecimals;
          if (zerosToAdd > 0) {
              formattedValue += '0'.repeat(zerosToAdd);
          }
      }
  }

  // 處理千分位
  if (thousands) {
      const [integerPart, decimalPart] = formattedValue.split('.');
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      formattedValue = decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  }

  return formattedValue;
}

export function truncateDecimalPlaces(num, decimalPlaces = 2) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.floor(num * factor) / factor;
}

export function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}