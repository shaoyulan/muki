import moment from 'moment'

/**
 * 轉換資料格式
 * by ChatGPT
 * @param {*} obj 
 * @returns 
 */
export function snakeToCamel(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => snakeToCamel(item))
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/(_\w)/g, match => match[1].toUpperCase())
    const value = obj[key]
    acc[camelKey] = snakeToCamel(value)
    return acc
  }, {})
}

/**
 * 非空資料
 */
export function notEmpty(source, type) {
  if (type === 'array') {
    return notEmptyArray(source)
  }
  if (type === 'object') {
    return notEmptyObjct(source)
  }
  return source !== undefined && source !== null && source !== ''
}


/**
 * 非空物件
 */
export function notEmptyObjct(source) {
  return source && Object.keys(source).length > 0
}

/**
 * 非空陣列
 */
export function notEmptyArray(source) {
  return Array.isArray(source) && source.length > 0
}

/** 
 * 產生數字陣列
 * @param {number} start
 * @param {number} end
 * @return {number[]}
 */
export function makeRange(start, end) {
  const result = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}

/**
 * 檢查陣列的時間是否有重疊
 * @param {Array} toCompare - (["9:00", "12:00"]) 
 * @param {Array} timeSegments - ([ ["9:00", "12:00"] , ["9:00", "12:00"] ]) 
 * @returns {Boolean} 
 */
export function checkTimeArrayOverlap(toCompare, timeSegments) {
  // if (timeSegments.length === 1) return false;
  var toCompare = toCompare.slice()
  var timeSegments = timeSegments.slice()


  function compare(segements) {
    // 比較前須讓數字都是2位數
    var segements = segements.slice().map(arr => {
      return arr.map(str => {
        var splited = str.split(':')
        var h = parseInt(splited[0]) || 0
        var m = parseInt(splited[1]) || 0

        return `${padNum(h, 2)}:${padNum(m, 2)}`
      })
    })

    segements.sort((timeSegment1, timeSegment2) =>
      timeSegment1[0].localeCompare(timeSegment2[0])
    )

    console.log('timeSegments', timeSegments)

    for (let i = 0; i < segements.length - 1; i++) {
      const currentEndTime = segements[i][1]
      const nextStartTime = segements[i + 1][0]

      if (currentEndTime > nextStartTime) {
        return true
      }
    }

    return false
  }

  var result = false

  timeSegments.some(arr => {
    var result2 = compare([arr, toCompare])
    if (result2) {
      result = true
      return true
    }
  })

  return result
};

/**
 * 建立一個Pending 狀態的 Promise
 * @returns {Object}
 * @property {Object} promise - promise
 * @property {Function} resolve - resolve
 * @property {Function} reject - reject
 */
export function pendingPromise() {

  var outerResolve
  var outerReject

  var promise = new Promise((resolve, reject) => {
    outerResolve = resolve
    outerReject = reject
  })

  return {
    promise,
    resolve: outerResolve,
    reject: outerReject
  }
}

// 下載
export function downloadFile(src, fileName = '美加') {

  if (!src) {
    console.log('downloadFile 未指定 src')
    return
  }

  // 使用href方式
  function byHref(src, fileName) {
    var vLink = document.createElement('a')
    vLink.download = fileName
    vLink.target = '_blank'
    vLink.href = src

    vLink.click()
  }

  // 使用fetch方式
  function byFetch(src, fileName) {
    fetch(src)
      .then(resp => resp.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        // the filename you want
        a.download = fileName
        a.click()
        window.URL.revokeObjectURL(url)
      })
      .catch(() => {
        byHref(src, fileName)
      })
  }

  byFetch(src, fileName)
}

// 數字Pad
export function padNum(num, length, toPad) {
  return (num + "").padStart(length, toPad || '0')
}


/**
 * 限定條件下的可用時間資料
 * @description 給定HH:mm與限制條件，並回傳可用的Hours陣列、minutes陣列
 * 
 * @param {object} data
 * @param {[number, number]} data.maxTime - 上限時間 ([14, 20])
 * @param {[number, number]} data.minTime - 下限時間 ([7, 9])
 * @param {[number, number]} data.nowTime - 當前時間 ([13, 30])
 * @param {() => number[]} data.disabledHours - disable的時
 * @param {(hour: number) => number[]} data.disabledMinutes - disable的分
 * 
 * @return {{hArr: number[], mArr: number[]}}
 */
export function conditionAvailableTimeData(data) {

  /** 
   * 產生數字陣列
   * @param {number} start
   * @param {number} end
   * @return {number[]}
   */
  const makeRange = (start, end) => {
    const result = []
    for (let i = start; i <= end; i++) {
      result.push(i)
    }
    return result
  }

  var hArr = []
  var mArr = []

  var now = new Date()

  var maxTime = data.maxTime || [23, 59]
  var maxH = maxTime[0]
  var maxM = maxTime[1]

  var minTime = data.minTime || [0, 0]
  var minH = minTime[0]
  var minM = minTime[1]

  var nowTime = data.nowTime || [now.getHours(), now.getMinutes()]
  var nowH = nowTime[0]
  var nowM = nowTime[1] // nowM的值對minute可用的範圍沒有影響

  // 時
  for (var h = minH; h <= maxH; h++) {
    hArr.push(h)
  }

  // 分
  if (nowH == maxH && nowH == minH) {
    // 最小小時 == 最大小時

    mArr = mArr.concat(makeRange(minM, maxM))

  } else if (nowH == maxH) {

    mArr = mArr.concat(makeRange(0, maxM))

  } else if (nowH == minH) {

    mArr = mArr.concat(makeRange(minM, 59))

  } else {

    mArr = mArr.concat(makeRange(0, 59))
  }

  // 處理disabled的部分
  if ('function' === typeof data.disabledHours) {
    var disabledHours = data.disabledHours()
    if (Array.isArray(disabledHours)) {
      hArr = hArr.filter(h => disabledHours.indexOf(h) == -1)
    }
  }

  if ('function' === typeof data.disabledMinutes) {
    var disabledMinutes = data.disabledMinutes(nowH)
    if (Array.isArray(disabledMinutes)) {
      mArr = mArr.filter(h => disabledMinutes.indexOf(h) == -1)
    }
  }

  return {
    hArr: hArr,
    mArr: mArr,
  }
}

/**
 * 限定條件下的可用日期資料
 * @param {Object} data
 * @param {Array} data.maxDate - 上限日期 ([2044, 2, 8])
 * @param {Array} data.minDate - 下限日期 ([1994, 2, 8])
 * @param {Array} data.nowDate - 當前日期 ([2008, 2, 8])
 */
export function conditionAvailableDateData(data) {
  var yArr = []
  var mArr = []
  var dArr = []

  var today = new Date()
  var maxDate = data.maxDate || [today.getFullYear() + 10, 12, 31]
  var maxY = parseInt(maxDate[0])
  var maxM = parseInt(maxDate[1])
  var maxD = parseInt(maxDate[2])

  var minDate = data.minDate || [today.getFullYear(), 1, 1]
  var minY = parseInt(minDate[0])
  var minM = parseInt(minDate[1])
  var minD = parseInt(minDate[2])

  var nowDate = data.nowDate || [today.getFullYear(), today.getMonth() + 1, today.getDate()]
  var nowY = parseInt(nowDate[0])
  var nowM = parseInt(nowDate[1])
  var nowD = parseInt(nowDate[2])


  function getMaxDays(year, month) {
    var days = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31)
    var year = year
    var month = month

    // 判斷2月份是28天還是29天
    if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
      days[1] = 29
    }

    var i_end = days[month - 1]
    return i_end
  }

  // 年
  for (var y = minY; y <= maxY; y++) {
    yArr.push(y)
  }

  // 月
  if (nowY == maxY) {
    for (var m = 1; m <= maxM; m++) {
      mArr.push(m)
    }
  } else if (nowY == minY) {
    for (var m = minM; m <= 12; m++) {
      mArr.push(m)
    }
  } else {
    for (var m = 1; m <= 12; m++) {
      mArr.push(m)
    }
  }

  // 日
  var avalDays = getMaxDays(nowY, nowM)
  if (nowY == maxY && nowM == maxM) {
    var thisMaxDays = avalDays > maxD ? maxD : avalDays

    for (var d = 1; d <= thisMaxDays; d++) {
      dArr.push(d)
    }
  } else if (nowY == minY && nowM == minM) {

    for (var d = minD; d <= avalDays; d++) {
      dArr.push(d)
    }

  } else {

    for (var d = 1; d <= avalDays; d++) {
      dArr.push(d)
    }
  }


  return {
    yArr: yArr,
    mArr: mArr,
    dArr: dArr
  }
}

/**
 * 日期時間解析
 * @param {*} date - 時間 (可被Date parsse的格式)
 * @param {String} momentFormat - moment套件格式表示字串 (YYYY.MM.DD)
 * @param {*} modifierFunc - 可在此modifier回傳參數 ( ({mm, weekDay}) => 顯示的字串 )
 */
export function dateTimeParse(date, momentFormat, modifierFunc) {
  var mm = momentFormat ? moment(date, momentFormat) : moment(date)

  if (!mm.isValid()) return

  var result
  var afterModify
  var zhWeekDayNum = numberToZHWeekday(mm._d.getDay())

  if ('function' == typeof modifierFunc) {
    afterModify = modifierFunc({
      mm: mm,
      weekDay: zhWeekDayNum
    })
  }

  if (afterModify) result = afterModify

  if (!result) result = mm

  return result
}

/**
 * 數值轉中文數字天號碼
 * @param {*} number 
 * @return {String} ZHNumber 
 */
export function numberToZHWeekday(number) {
  switch (number) {
    case 1:
      return '一'
      break
    case 2:
      return '二'
      break
    case 3:
      return '三'
      break
    case 4:
      return '四'
      break
    case 5:
      return '五'
      break
    case 6:
      return '六'
      break
    case 0:
      return '日'
      break
    default:
      break
  }
}

/**
 * 物件轉換為FormData
 * 
 * @param {*} obj 
 * @param {*} form 
 * @param {*} namespace 
 * @returns 
 * 
 * @see https://stackoverflow.com/a/64873325/20237601
 * @see https://gist.github.com/ghinda/8442a57f22099bdb2e34
 */
export function transformToFormData(obj, form, namespace) {
  var fd = form || new FormData()
  var formKey

  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {

      if (namespace) {
        formKey = namespace + '[' + property + ']'
      } else {
        formKey = property
      }

      // if the property is an object, but not a File,
      // use recursivity.
      if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {

        transformToFormData(obj[property], fd, formKey)

      } else {
        // if it's a string or a File object
        fd.append(formKey, obj[property])
      }
    }
  }

  return fd
}

/**
 * 生成uuid
 * @returns {String} uuid
 */
export function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

/**
 * api回傳值parse
 * @param {*} res 
 * @param {*} success 
 * @param {*} fail 
 * @returns {Object} return
 * @property {Function} return.onSuccess - ( ({res, data, msg, defaultAlert }) => void )
 * @property {Function} return.onFail - ( ({res, data, msg, defaultAlert }) => void )
 */
export function ajax200Res(res, success, fail) {

  let successCallback = ''
  let failCallback = ''

  // flag
  let isSuccess = false
  // 給callback的資料
  let dataToSend = ''
  let msg = ''

  let defaultAlert = () => {
    return new Promise((resolve, reject) => {

      if (!msg) {
        resolve()
        return
      }

      _alert_custom("訊息提示", msg, function () {
        resolve()
      })
    })
  }

  function onSuccess(callBack) {

    if (!isSuccess) return

    if ('function' === typeof callBack) {
      successCallback = callBack
      handleCallBack()
    }
  }

  function onFail(callBack) {

    if (isSuccess) return

    if ('function' === typeof callBack) {
      failCallback = callBack
      handleCallBack()
    }
  }

  function handleCallBack(isArgumentCallBack) {

    const toSend = { res, data: dataToSend, msg, defaultAlert }

    if (isSuccess) {
      if ('function' === typeof successCallback && !isArgumentCallBack) {
        successCallback(toSend)
      }
      if ('function' === typeof success) {
        success(toSend)
      }
    } else {
      if ('function' === typeof failCallback && !isArgumentCallBack) {
        failCallback(toSend)
      }
      if ('function' === typeof fail) {
        fail(toSend)
      }
    }
  }

  // 解析Res
  function parseRes() {

    if (res) {

      const { data, status } = res

      if (data) {

        const resData = data['res_data']
        msg = data["res_content"]
        dataToSend = resData ? resData : data

        if (status == 200 && data["res_code"] == 1) {

          isSuccess = true

        } else {
          // fail
          // 不是200 + 沐奇自訂res_code == 1，就視為fail

        };

      } else {
        // fail
        // 沒有 data 視為fail
      }
    } else {
      // fail
      // 沒有 res 視為fail
    }
  }

  // 解析
  parseRes()

  // 等解析完成
  handleCallBack(true)

  return {
    onSuccess,
    onFail
  }
}

export const MukiUtil = {
  /**
   * 是否是jQuery 物件
   * @param {*} target 
   * @returns Boolean
   */
  isjQueryObject: function (target) {
    return target instanceof jQuery
  },
  /**
   * 是否是 ISO8601 日期字串格式
   * @param {*} data 
   * @returns Boolean
   */
  isIsoDate: function (data) {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(data)) return false
    var d = new Date(str)
    return d.toISOString() === str
  },
  /**
   * 是否是 JSON 
   * @param {*} data 
   * @returns Boolean
   */
  isJSON: function (data) {

  },
  /**
   * 轉成數值
   * @param {*} data 
   * @returns Number
   */
  toNumber: function (data) {
    if ('number' === typeof data) {
      return data
    }
    if ('string' === typeof data) {
      var n = parseInt(data.trim().replace(/,/g, ''))
      return n
    }
  },
  /**
   * 產生uuid
   * @returns String
   */
  uuid: function () {
    var d = Date.now()
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now() //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
  },
  /**
   * 不是undefined
   * @param {*} data 
   * @returns Boolean
   */
  notUndefined(data) {
    return data !== undefined
  },
  /**
   * 不是null
   * @param {*} data 
   * @returns Boolean
   */
  notNull(data) {
    return data !== null
  },
  /**
   * 不是空值
   * @param {*} data 
   * @returns Boolean
   */
  notEmpty(data) {
    return data !== ''
  },
  /**
   * 產生min到max之間的亂數
   * @param {*} min 
   * @param {*} max 
   * @returns Number
   */
  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

/**
 * 滑置目標位置
 * @param {*} setting 
 */
export function mukiScrollTo(setting) {
  var defaultSetting = {
    view: 'body',
    position: 'viewCenter',
    target: null, // 捲動目標
    header: null, // el
    cushionGap: 0, // 緩衝空間,
    complete: function () { }
  }

  var newSetting = $.extend(true, {}, defaultSetting, setting)

  var target = $(newSetting.target)
  var targetH = target.outerHeight()
  var header = $(newSetting.header)
  var headerH = _getHeaderHeight()
  var cushionGap = newSetting.cushionGap

  // 距離目標頂端
  let numWhenViewToTargetTop = window.innerHeight / 2

  var scrollTop = 0
  var position = target.offset().top

  function _getHeaderHeight() {
    return header.length ? header.height() : 0
  }


  if (target.length) {

    // 捲到 視窗中間
    if (newSetting.position == 'viewCenter') {
      scrollTop = position - numWhenViewToTargetTop + (targetH / 2)
    }

    $("html, body").animate({
      scrollTop: scrollTop - headerH - cushionGap,
    }, {
      duration: 300,
      step: function (now, fx) {
        var nowHeaderH = _getHeaderHeight()
        // scroll時自動針對header的高度變化調整 目標值
        if (nowHeaderH !== headerH) {
          headerH = nowHeaderH
          fx.end = scrollTop - nowHeaderH - cushionGap
        }
      },
      complete: function () {
        if ('function' === typeof newSetting.complete) {
          newSetting.complete()
        }
      }
    })
  }
}


/**
 * Canvas 是否是空的
 * @param {*} canvas 
 * @returns {Boolean}
 */
export function isCanvasBlank(canvas) {
  var blank = document.createElement('canvas')
  blank.width = canvas.width
  blank.height = canvas.height

  blank.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
  return canvas.toDataURL() == blank.toDataURL()
}

/**
 * 取得scrolllbar width
 * @returns {Number}
 */
export function getScrollbarWidth() {
  // Creating invisible container
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll' // forcing scrollbar to appear
  outer.style.msOverflowStyle = 'scrollbar' // needed for WinJS apps
  document.body.appendChild(outer)

  // Creating inner element and placing it in the container
  const inner = document.createElement('div')
  outer.appendChild(inner)

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth)

  // Removing temporary elements from the DOM
  outer.parentNode.removeChild(outer)

  return scrollbarWidth
}


/**
 * 網頁是否在 iframe 裡
 * @returns {Boolean}
 */
export function isInIframe() {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

/**
 * 取的條件下的rwd值
 * @param {*} minScreen 
 * @param {*} minValue 
 * @param {*} maxScreen 
 * @param {*} maxValue 
 * @param {*} viewWidth 
 * @returns 
 */
export function rwdVal(minScreen, minValue, maxScreen, maxValue, viewWidth = window.innerWidth) {
  var a = (maxValue - minValue) / (maxScreen - minScreen)
  var b = minValue - a * minScreen
  var result = 0

  if (b < 0) {
    result = (a * viewWidth - Math.abs(b))
  } else {
    result = (a * viewWidth + b)
  }

  if (!result) {
    result = 0
  }

  return result
}

export function appRwdVal(minScreen, minValue, maxScreen, maxValue) {
  var viewWidth = window.innerWidth

  if (viewWidth > maxScreen) {
    viewWidth = maxScreen
  }

  if (viewWidth < minScreen) {
    viewWidth = minScreen
  }

  return rwdVal(minScreen, minValue, maxScreen, maxValue, viewWidth)
}


/**
 * 簡易數值解析
 * 
 * 簡易，故只考慮$、分位、小數點。其餘須從來源端修正
 * 
 * @param {Number|String} numberOrString - ("15,000")
 * @return {Number} result
 */
export function parseSimpleNumber(numberOrString){

  var isString = 'string' === typeof numberOrString;
  var parsedValue = parseFloat(numberOrString);
  var isNumber = !isString && !isNaN(parsedValue);

  if ( isNumber ) return numberOrString

  if ( isString ) {
      var cleaned = numberOrString;

      // 分位
      cleaned = numberOrString.replace(/,/g,'')
      // $
      cleaned = cleaned.replace(/\$/g,'')

      cleaned = parseFloat(cleaned)

      return cleaned
  }

  return 0
}


/**
 * 解碼HTML Entity
 * @param {string} str 
 * @returns {string}
 * @see https://stackoverflow.com/a/1395954
 */
export function decodeHtmlEntity(str) {
  var textArea = document.createElement('textarea')
  textArea.innerHTML = str
  return textArea.value
}


/**
 * 列表內容是否要載入更多
 * @param {Object} - 捲動的內容
 * @property {HTMLElement} scrollElement - 目標容器 
 * @property {Function} callback - 載入更多callback 
 */
export function scrollContentCanLoadMore(scrollElement, callback) {
  var scrollElement = $(scrollElement)[0]

  function _check(scrollElement) {
    if (!scrollElement || !$(scrollElement).length) return

    var isReachEnd = (scrollElement.scrollTop + scrollElement.clientHeight) - scrollElement.scrollHeight <= scrollElement.clientHeight

    if (isReachEnd) {
      if ('function' == typeof callback) {
        callback()
      }
    }
  }

  const check = _.debounce(_check, 300)

  if (!scrollElement) return
  if (!scrollElement.addEventListener) return

  scrollElement.addEventListener('scroll', () => {
    check(scrollElement)
  })

  check(scrollElement)

}


/**
 * 列表內滑至頂部
 * @param {Object} - 捲動的內容
 * @returns {Promise} - 已滑到位置
 */
export function scrollContentGotop(scrollElement) {

  var aniTime = 300

  return new Promise((resolve, reject) => {

    if (!$(scrollElement).length) resolve()

    if ($(scrollElement)[0].scrollTop <= 20) {
      aniTime = 0
    }

    $(scrollElement).animate({
      scrollTop: 0
    }, aniTime, () => {
      resolve()
    })
  })
}

/**
 * 避免Action瞬間切換的控制
 * @param {Object} config
 * @property {Number} config.startDelay - 開始執行前的delay (default: 300ms)
 * @property {Number} config.waitMinTime - 最少要等候的時間 (default: 600ms)
 * @property {Function} config.onStart
 * @property {Function} config.onStop
 * 
 * @returns {object} 
 */
export function useDontFlashActionControl(config) {

  var dontFlashPromise = ''
  var StartTimeout

  function start() {
    StartTimeout = setTimeout(function () {
      // onStart
      if ('function' === typeof config.onStart) {
        config.onStart()
      }

      // 至少顯示一小段時間，不要閃一下
      dontFlashPromise = new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, config.waitMinTime || 600)
      })

    }, config.startDelay || 300)
  }

  function _stop() {
    // onClose
    if ('function' === typeof config.onStop) {
      config.onStop()
    }
  }

  // stop callback
  function stop() {
    clearTimeout(StartTimeout)

    // hide loading
    if (!dontFlashPromise) {
      _stop()
    } else {
      dontFlashPromise.then(() => {
        _stop()
      })
    }
  }

  return {
    start,
    stop
  }
}


// 計數器
export function Counter(options) {
  var timer
  var instance = this
  var seconds = options.seconds || 10
  var onUpdateStatus = options.onUpdateStatus || function () { }
  var onCounterEnd = options.onCounterEnd || function () { }
  var onCounterStart = options.onCounterStart || function () { }

  function decrementCounter() {
    onUpdateStatus(seconds)
    if (seconds === 0) {
      stopCounter()
      onCounterEnd()
      return
    }
    seconds--
  };

  function startCounter() {
    onCounterStart()
    clearInterval(timer)
    timer = 0
    decrementCounter()
    timer = setInterval(decrementCounter, 1000)
  };

  function stopCounter() {
    clearInterval(timer)
  };

  return {
    start: function () {
      startCounter()
    },
    stop: function () {
      stopCounter()
    }
  }
};


// ==== Component 元件
/**
 * Radio 核選框
 * @param {*} setting
 * @property {} setting.emit
 * @property {} setting.modelValue
 * @property {} setting.value
 * @property {} setting.name
 * @property {} setting.required
 * @property {} setting.disabled
 */
export function Radio(setting) {
  const emit = setting.emit
  const modelValue = computed(() => setting.modelValue)
  const _modelValue = ref(setting.modelValue)
  const value = computed(() => setting.value)
  const name = computed(() => setting.name)
  const required = computed(() => setting.required)
  const disabled = computed(() => setting.disabled)

  // 同步內部值
  watch(() => modelValue.value, () => {
    _modelValue.value = modelValue.value
  })

  // 同步外部值
  watch(() => _modelValue.value, () => {
    emit('update:modelValue', _modelValue.value)
  })

  const isSelected = computed(() => {
    if (_modelValue.value === undefined)
      return false

    return _modelValue.value === value.value
  })

  const toggleCheck = () => {
    if (!disabled.value) {
      /**
             * 不使用 emit update:modelValue。這樣可以在元件沒綁定v-model時仍可以勾選
             */
      _modelValue.value = value.value
    }
  }

  return {
    modelValue,
    value,
    name,
    required,
    disabled,
    isSelected,
    toggleCheck,
  }
}

/**
 * Checkbox 核選框
 * @param {*} setting
 * @property {} setting.emit
 * @property {} setting.modelValue
 * @property {} setting.value
 * @property {} setting.name
 * @property {} setting.required
 * @property {} setting.disabled
 */
export function Checkbox(setting) {
  const emit = setting.emit
  const modelValue = computed(() => setting.modelValue)
  const _modelValue = ref(setting.modelValue)
  const value = computed(() => setting.value)
  const name = computed(() => setting.name)
  const required = computed(() => setting.required)
  const disabled = computed(() => setting.disabled)

  const isModelArray = computed(() => {
    return Array.isArray(modelValue.value)
  })
  const hasValue = computed(() => value.value !== undefined && value.value !== '' && value.value !== null)

  const falseValue = false
  const trueValue = true

  // 同步內部值
  watch(() => modelValue.value, () => {
    _modelValue.value = modelValue.value
  })

  // 同步外部值
  watch(() => _modelValue.value, () => {
    emit('update:modelValue', _modelValue.value)
  })

  const isSelected = computed(() => {
    if (isModelArray.value)
      return _modelValue.value.includes(value.value)

    if (hasValue.value)
      return _modelValue.value === value.value

    return _modelValue.value === trueValue
  })

  const removeItemFromModel = (newModel) => {
    const index = newModel.indexOf(value.value)

    if (index !== -1)
      newModel.splice(index, 1)
  }

  const handleArrayCheckbox = () => {
    const newModel = _modelValue.value

    if (!isSelected.value)
      newModel.push(value.value)

    else
      removeItemFromModel(newModel)

    /**
         * 不使用 emit update:modelValue。這樣可以在元件沒綁定v-model時仍可以勾選
         */
    _modelValue.value = newModel
  }

  const handleSingleSelectCheckbox = () => {
    /**
         * 不使用 emit update:modelValue。這樣可以在元件沒綁定v-model時仍可以勾選
         */
    _modelValue.value = isSelected.value ? null : value.value
  }

  const handleSimpleCheckbox = () => {
    /**
         * 不使用 emit update:modelValue。這樣可以在元件沒綁定v-model時仍可以勾選
         */
    _modelValue.value = isSelected.value ? falseValue : trueValue
  }

  const toggleCheck = () => {
    if (!disabled.value) {
      if (isModelArray.value) {
        handleArrayCheckbox()
      }
      else if (hasValue.value) {
        console.log('handleSingleSelectCheckbox', modelValue, _modelValue)
        handleSingleSelectCheckbox()
      }
      else {
        console.log('handleSimpleCheckbox')

        handleSimpleCheckbox()
      }
    }
  }

  return {
    modelValue,
    value,
    name,
    required,
    disabled,
    isSelected,
    toggleCheck,
  }
}