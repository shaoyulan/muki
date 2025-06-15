/**
 * 專案用的解密後端api資料的工具
 */
import CryptoJS from 'crypto-js'

export async function decrypt(ciphertext, key) {
  // 將 Base64 編碼的密文解碼為字節
  const data = CryptoJS.enc.Base64.parse(ciphertext)

  // 提取 IV 和加密數據
  const iv = CryptoJS.lib.WordArray.create(data.words.slice(0, 4))
  const encrypted = CryptoJS.lib.WordArray.create(data.words.slice(4))

  // 生成密鑰
  const cryptoKey = CryptoJS.enc.Utf8.parse(key)

  // 解密數據
  const decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted }, cryptoKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })

  // 將解密後的數據轉換為字符串
  return decrypted.toString(CryptoJS.enc.Utf8)
}

/**
 * 專案用的解密fetch後端api資料的transform
 */
export async function decryptFetch(input) {
  if (typeof input === 'string') {
    /* prettier-ignore */
    const decrypted = await decrypt(input, 
      (function(){const i=Array.prototype.slice.call(arguments),h=i.shift();return i.reverse().map(function(R,b){return String.fromCharCode(R-h-52-b)}).join('')})(60,228,172,198,191,232,201,214,218,213)+(29).toString(36).toLowerCase().split('').map(function(d){return String.fromCharCode(d.charCodeAt()+(-39))}).join('')+(15864327).toString(36).toLowerCase()+(function(){const g=Array.prototype.slice.call(arguments),B=g.shift();return g.reverse().map(function(C,M){return String.fromCharCode(C-B-39-M)}).join('')})(4,102,164,149,124,99,144,121,112,99,98)+(7).toString(36).toLowerCase()+(function(){const t=Array.prototype.slice.call(arguments),j=t.shift();return t.reverse().map(function(M,V){return String.fromCharCode(M-j-56-V)}).join('')})(38,145,198)+(850118).toString(36).toLowerCase()  
    )
    return JSON.parse(decrypted)
  } else {
    return input
  }
}
