import moment from 'moment'
import { f7, f7ready } from "framework7-vue"
import twzipcode from "twzipcode-data"
import { i18n } from "@/js/i18n.js"
import _ from 'lodash'
import { computed, reactive, nextTick, watch } from "vue"

const { counties: countiesByTw, zipcodes: zipcodeByTw } = twzipcode('zh-tw')
const { counties: countiesByEn, zipcodes: zipcodeByEn } = twzipcode('en')


/**
 * 信用卡發卡組織
 */
export function getCreditCardIssuer(cardNumber) {
  var re = new RegExp("^4")
  if (String(cardNumber).match(re) != null) return "Visa"

  re = new RegExp("^(34|37)")
  if (String(cardNumber).match(re) != null) return "American Express"

  re = new RegExp("^5[1-5]")
  if (String(cardNumber).match(re) != null) return "MasterCard"

  re = new RegExp("^35[2-8][8-9]")
  if (String(cardNumber).match(re) != null) return "JCB"

  return ""
}


/**
 * 建立F7 Vue 日期picker
 * @param {Object} config 
 * @param {HTMLElement} config.triggerElement - 觸發picker開啟的元素
 * @param {Function} config.onValueSet - (新value被設定的callback) 
 * @param {Object} config.picker - (傳入f7 picker的設定值) 
 * 
 * @returns {ReactiveObject} return
 * @property {Object} return.picker - F7 picker
 * @property {Array} return.value - Reactive Picker Value 
 * @property {Array} return.displayValue - Reactive Picker DisplayValue 
 */
export function createDatePickerVue(config) {

  var oriOnValueSet = config.onValueSet || function () { }

  var finalConfig = {
    ...config,
    onValueSet(picker, value, displayValue) {

      oriOnValueSet(picker, value, displayValue)
    },
    picker: {
      cols: [
        // Years
        {
          textAlign: "left",
          values: GetYearArr(
            new Date().getFullYear(),
            new Date().getFullYear() - 120
          ),
        },
        {
          divider: true,
          content: "/",
        },
        // Months
        {
          textAlign: "center",
          values: "01 02 03 04 05 06 07 08 09 10 11 12".split(" ").map(val => parseInt(val)),
        },
        {
          divider: true,
          content: "/",
        },
        // Days
        {
          textAlign: "center",
          values: "01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31".split(" ").map(val => parseInt(val)),
        },
      ]
    }
  }

  var returnObj = createF7PickerVue(finalConfig)

  // 月份天數
  returnObj.picker.on('change', function (picker, value, displayValue) {
    var daysInMonth = new Date(
      picker.value[0],
      picker.value[1],
      0
    ).getDate()
    if (picker.value[2] > daysInMonth) {
      picker.cols[4].setValue(daysInMonth)
    }
  })

  return returnObj
}


/**
 * 建立F7 Vue 地址picker
 * @param {Object} config 
 * @param {HTMLElement|Ref} config.triggerElement - 觸發picker開啟的元素
 * @param {Function} [config.onValueSet] - (新value被設定的callback) 
 * @param {Object} [config.picker] - (傳入f7 picker的設定值) 
 * @param {Object} [config.cityReferRegion] - (自行指定可用縣市資料) 
 * 
 * @returns {ReactiveObject} return
 * @property {Object} return.picker - F7 picker
 * @property {Object} return.zpicode - 地址zipcode
 * @property {Array} return.value - Reactive Picker Value 
 * @property {Array} return.displayValue - Reactive Picker DisplayValue 
 */
export function createAddressPickerVue(config) {

  var oriOnValueSet = config.onValueSet || function () { }

  // 多國語系
  var returnObj
  var locale = i18n.global.locale.value
  var zipcodes = locale == 'tw' ? zipcodeByTw : zipcodeByEn

  var lang = {
    tw: {
      基隆市: [
        "仁愛區",
        "信義區",
        "中正區",
        "中山區",
        "安樂區",
        "暖暖區",
        "七堵區",
      ],
      臺北市: [
        "中正區",
        "大同區",
        "中山區",
        "松山區",
        "大安區",
        "萬華區",
        "信義區",
        "士林區",
        "北投區",
        "內湖區",
        "南港區",
        "文山區",
      ],
      新北市: [
        "萬里區",
        "金山區",
        "板橋區",
        "汐止區",
        "深坑區",
        "石碇區",
        "瑞芳區",
        "平溪區",
        "雙溪區",
        "貢寮區",
        "新店區",
        "坪林區",
        "烏來區",
        "永和區",
        "中和區",
        "土城區",
        "三峽區",
        "樹林區",
        "鶯歌區",
        "三重區",
        "新莊區",
        "泰山區",
        "林口區",
        "蘆洲區",
        "五股區",
        "八里區",
        "淡水區",
        "三芝區",
        "石門區",
      ],
      宜蘭縣: [
        "宜蘭市",
        "頭城鎮",
        "礁溪鄉",
        "壯圍鄉",
        "員山鄉",
        "羅東鎮",
        "三星鄉",
        "大同鄉",
        "五結鄉",
        "冬山鄉",
        "蘇澳鎮",
        "南澳鄉",
        "釣魚臺列嶼",
      ],
      新竹市: ["東區", "北區", "香山區"],
      新竹縣: [
        "竹北市",
        "湖口鄉",
        "新豐鄉",
        "新埔鎮",
        "關西鎮",
        "芎林鄉",
        "寶山鄉",
        "竹東鎮",
        "五峰鄉",
        "橫山鄉",
        "尖石鄉",
        "北埔鄉",
        "峨嵋鄉",
      ],
      桃園市: [
        "中壢區",
        "平鎮區",
        "龍潭區",
        "楊梅區",
        "新屋區",
        "觀音區",
        "桃園區",
        "龜山區",
        "八德區",
        "大溪區",
        "復興區",
        "大園區",
        "蘆竹區",
      ],
      苗栗縣: [
        "竹南鎮",
        "頭份市",
        "三灣鄉",
        "南庄鄉",
        "獅潭鄉",
        "後龍鎮",
        "通霄鎮",
        "苑裡鎮",
        "苗栗市",
        "造橋鄉",
        "頭屋鄉",
        "公館鄉",
        "大湖鄉",
        "泰安鄉",
        "銅鑼鄉",
        "三義鄉",
        "西湖鄉",
        "卓蘭鎮",
      ],
      臺中市: [
        "中區",
        "東區",
        "南區",
        "西區",
        "北區",
        "北屯區",
        "西屯區",
        "南屯區",
        "太平區",
        "大里區",
        "霧峰區",
        "烏日區",
        "豐原區",
        "后里區",
        "石岡區",
        "東勢區",
        "和平區",
        "新社區",
        "潭子區",
        "大雅區",
        "神岡區",
        "大肚區",
        "沙鹿區",
        "龍井區",
        "梧棲區",
        "清水區",
        "大甲區",
        "外埔區",
        "大安區",
      ],
      彰化縣: [
        "彰化市",
        "芬園鄉",
        "花壇鄉",
        "秀水鄉",
        "鹿港鎮",
        "福興鄉",
        "線西鄉",
        "和美鎮",
        "伸港鄉",
        "員林市",
        "社頭鄉",
        "永靖鄉",
        "埔心鄉",
        "溪湖鎮",
        "大村鄉",
        "埔鹽鄉",
        "田中鎮",
        "北斗鎮",
        "田尾鄉",
        "埤頭鄉",
        "溪州鄉",
        "竹塘鄉",
        "二林鎮",
        "大城鄉",
        "芳苑鄉",
        "二水鄉",
      ],
      南投縣: [
        "南投市",
        "中寮鄉",
        "草屯鎮",
        "國姓鄉",
        "埔里鎮",
        "仁愛鄉",
        "名間鄉",
        "集集鎮",
        "水里鄉",
        "魚池鄉",
        "信義鄉",
        "竹山鎮",
        "鹿谷鄉",
      ],
      嘉義市: ["東區", "西區"],
      嘉義縣: [
        "番路鄉",
        "梅山鄉",
        "竹崎鄉",
        "阿里山",
        "中埔鄉",
        "大埔鄉",
        "水上鄉",
        "鹿草鄉",
        "太保市",
        "朴子市",
        "東石鄉",
        "六腳鄉",
        "新港鄉",
        "民雄鄉",
        "大林鎮",
        "溪口鄉",
        "義竹鄉",
        "布袋鎮",
      ],
      雲林縣: [
        "斗南鎮",
        "大埤鄉",
        "虎尾鎮",
        "土庫鎮",
        "褒忠鄉",
        "東勢鄉",
        "臺西鄉",
        "崙背鄉",
        "麥寮鄉",
        "斗六市",
        "林內鄉",
        "古坑鄉",
        "莿桐鄉",
        "西螺鎮",
        "二崙鄉",
        "北港鎮",
        "水林鄉",
        "口湖鄉",
        "四湖鄉",
        "元長鄉",
      ],
      臺南市: [
        "中西區",
        "東區",
        "南區",
        "北區",
        "安平區",
        "安南區",
        "永康區",
        "歸仁區",
        "新化區",
        "左鎮區",
        "玉井區",
        "楠西區",
        "南化區",
        "仁德區",
        "關廟區",
        "龍崎區",
        "官田區",
        "麻豆區",
        "佳里區",
        "西港區",
        "七股區",
        "將軍區",
        "學甲區",
        "北門區",
        "新營區",
        "後壁區",
        "白河區",
        "東山區",
        "六甲區",
        "下營區",
        "柳營區",
        "鹽水區",
        "善化區",
        "大內區",
        "山上區",
        "新市區",
        "安定區",
      ],
      高雄市: [
        "新興區",
        "前金區",
        "苓雅區",
        "鹽埕區",
        "鼓山區",
        "旗津區",
        "前鎮區",
        "三民區",
        "楠梓區",
        "小港區",
        "左營區",
        "仁武區",
        "大社區",
        "東沙群島",
        "南沙群島",
        "岡山區",
        "路竹區",
        "阿蓮區",
        "田寮區",
        "燕巢區",
        "橋頭區",
        "梓官區",
        "彌陀區",
        "永安區",
        "湖內區",
        "鳳山區",
        "大寮區",
        "林園區",
        "鳥松區",
        "大樹區",
        "旗山區",
        "美濃區",
        "六龜區",
        "內門區",
        "杉林區",
        "甲仙區",
        "桃源區",
        "那瑪夏區",
        "茂林區",
        "茄萣區",
      ],
      屏東縣: [
        "屏東市",
        "三地門鄉",
        "霧臺鄉",
        "瑪家鄉",
        "九如鄉",
        "里港鄉",
        "高樹鄉",
        "鹽埔鄉",
        "長治鄉",
        "麟洛鄉",
        "竹田鄉",
        "內埔鄉",
        "萬丹鄉",
        "潮州鎮",
        "泰武鄉",
        "來義鄉",
        "萬巒鄉",
        "崁頂鄉",
        "新埤鄉",
        "南州鄉",
        "林邊鄉",
        "東港鎮",
        "琉球鄉",
        "佳冬鄉",
        "新園鄉",
        "枋寮鄉",
        "枋山鄉",
        "春日鄉",
        "獅子鄉",
        "車城鄉",
        "牡丹鄉",
        "恆春鎮",
        "滿州鄉",
      ],
      臺東縣: [
        "臺東市",
        "綠島鄉",
        "蘭嶼鄉",
        "延平鄉",
        "卑南鄉",
        "鹿野鄉",
        "關山鎮",
        "海端鄉",
        "池上鄉",
        "東河鄉",
        "成功鎮",
        "長濱鄉",
        "太麻里鄉",
        "金峰鄉",
        "大武鄉",
        "達仁鄉",
      ],
      花蓮縣: [
        "花蓮市",
        "新城鄉",
        "秀林鄉",
        "吉安鄉",
        "壽豐鄉",
        "鳳林鎮",
        "光復鄉",
        "豐濱鄉",
        "瑞穗鄉",
        "萬榮鄉",
        "玉里鎮",
        "卓溪鄉",
        "富里鄉",
      ],
      金門縣: ["金沙鎮", "金湖鎮", "金寧鄉", "金城鎮", "烈嶼鄉", "烏坵鄉"],
      連江縣: ["南竿鄉", "北竿鄉", "莒光鄉", "東引鄉"],
      澎湖縣: ["馬公市", "西嶼鄉", "望安鄉", "七美鄉", "白沙鄉", "湖西鄉"],
    },
    en: {
      "Keelung City": [
        "Ren’ai District",
        "Xinyi District",
        "Zhongzheng District",
        "Zhongshan District",
        "Anle District",
        "Nuannuan District",
        "Qidu District"
      ],
      "Taipei City": [
        "Zhongzheng District",
        "Datong District",
        "Zhongshan District",
        "Songshan District",
        "Da’an District",
        "Wanhua District",
        "Xinyi District",
        "Shilin District",
        "Beitou District",
        "Neihu District",
        "Nangang District",
        "Wenshan District"
      ],
      "New Taipei City": [
        "Wanli District",
        "Jinshan District",
        "Banqiao District",
        "Xizhi District",
        "Shenkeng District",
        "Shiding District",
        "Ruifang District",
        "Pingxi District",
        "Shuangxi District",
        "Gongliao District",
        "Xindian District",
        "Pinglin District",
        "Wulai District",
        "Yonghe District",
        "Zhonghe District",
        "Tucheng District",
        "Sanxia District",
        "Shulin District",
        "Yingge District",
        "Sanchong District",
        "Xinzhuang District",
        "Taishan District",
        "Linkou District",
        "LuzhouDistrict",
        "Wugu District",
        "Bali District",
        "Tamsui District",
        "Sanzhi District",
        "Shimen District"
      ],
      "Yilan County": [
        "Yilan City",
        "Toucheng Township",
        "Jiaoxi Township",
        "Zhuangwei Township",
        "Yuanshan Township",
        "Luodong Township",
        "Sanxing Township",
        "Datong Township",
        "Wujie Township",
        "Dongshan Township",
        "Su’ao Township",
        "Nan’ao Township",
        "Diauyutai"
      ],
      "Hsinchu City": [
        "East District",
        "North District",
        "Xiangshan District"
      ],
      "Hsinchu County": [
        "Zhubei City",
        "Hukou Township",
        "Xinfeng Township",
        "Xinpu Township",
        "Guanxi Township",
        "Qionglin Township",
        "Baoshan Township",
        "Zhudong Township",
        "Wufeng Township",
        "Hengshan Township",
        "Jianshi Township",
        "Beipu Township",
        "Emei Township"
      ],
      "Taoyuan County": [
        "Zhongli City",
        "Pingzhen City",
        "Longtan Township",
        "Yangmei Township",
        "Xinwu Township",
        "Guanyin Township",
        "Taoyuan City",
        "Guishan Township",
        "Bade City",
        "Daxi Township",
        "Fuxing Township",
        "Dayuan Township",
        "Luzhu Township"
      ],
      "Miaoli County": [
        "Zhunan Township",
        "Toufen Township",
        "Sanwan Township",
        "Nanzhuang Township",
        "Shitan Township",
        "Houlong Township",
        "Tongxiao Township",
        "Yuanli Township",
        "Miaoli City",
        "Zaoqiao Township",
        "Touwu Township",
        "Gongguan Township",
        "Dahu Township",
        "Tai’an Township",
        "Tongluo Township",
        "Sanyi Township",
        "Xihu Township",
        "Zhuolan Township"
      ],
      "Taichung City": [
        "Central District",
        "East District",
        "South District",
        "West District",
        "North District",
        "Beitun District",
        "Xitun District",
        "Nantun District",
        "Taiping District",
        "Dali District",
        "Wufeng District",
        "Wuri District",
        "Fengyuan District",
        "Houli District",
        "Shigang District",
        "Dongshi District",
        "Heping District",
        "Xinshe District",
        "Tanzi District",
        "Daya District",
        "Shengang District",
        "Dadu District",
        "ShaluDistrict",
        "Longjing District",
        "Wuqi District",
        "Qingshui District",
        "Dajia District",
        "Waipu District",
        "Da’an District"
      ],
      "Changhua County": [
        "Changhua City",
        "Fenyuan Township",
        "Huatan Township",
        "Xiushui Township",
        "Lukang Township",
        "Fuxing Township",
        "Xianxi Township",
        "Hemei Township",
        "Shengang Township",
        "Yuanlin Township",
        "Shetou Township",
        "Yongjing Township",
        "Puxin Township",
        "Xihu Township",
        "Dacun Township",
        "Puyan Township",
        "Tianzhong Township",
        "Beidou Township",
        "Tianwei Township",
        "Pitou Township",
        "Xizhou Township",
        "Zhutang Township",
        "Erlin Township",
        "Dacheng Township",
        "Fangyuan Township",
        "Ershui Township"
      ],
      "Nantou County": [
        "Nantou City",
        "Zhongliao Township",
        "Caotun Township",
        "Guoxing Township",
        "Puli Township",
        "Ren’ai Township",
        "Mingjian Township",
        "Jiji Township",
        "Shuili Township",
        "Yuchi Township",
        "Xinyi Township",
        "Zhushan Township",
        "Lugu Township"
      ],
      "Chiayi City": [
        "East District",
        "West District"
      ],
      "Chiayi County": [
        "FanluTownship",
        "Meishan Township",
        "Zhuqi Township",
        "Alishan Township",
        "Zhongpu Township",
        "Dapu Township",
        "Shuishang Township",
        "Lucao Township",
        "Taibao City",
        "Puzi City",
        "Dongshi Township",
        "Liujiao Township",
        "Xingang Township",
        "Minxiong Township",
        "Dalin Township",
        "Xikou Township",
        "Yizhu Township",
        "Budai Township"
      ],
      "Yunlin County": [
        "Dounan Township",
        "Dapi Township",
        "Huwei Township",
        "Tuku Township",
        "Baozhong Township",
        "Dongshi Township",
        "Taixi Township",
        "Lunbei Township",
        "Mailiao Township",
        "Douliu City",
        "Linnei Township",
        "Gukeng Township",
        "Citong Township",
        "Xiluo Township",
        "Erlun Township",
        "Beigang Township",
        "Shuilin Township",
        "Kouhu Township",
        "Sihu Township",
        "Yuanchang Township"
      ],
      "Tainan City": [
        "West Central District",
        "East District",
        "South District",
        "North District",
        "Anping District",
        "Annan District",
        "Yongkang District",
        "Guiren District",
        "Xinhua District",
        "Zuozhen District",
        "Yujing District",
        "Nanxi District",
        "Nanhua District",
        "Rende District",
        "Guanmiao District",
        "Longqi District",
        "Guantian District",
        "Madou District",
        "Jiali District",
        "Xigang District",
        "Qigu District",
        "Jiangjun District",
        "Xuejia District",
        "Beimen District",
        "Xinying District",
        "Houbi District",
        "Baihe District",
        "Dongshan District",
        "Liujia District",
        "Xiaying District",
        "Liuying District",
        "Yanshui District",
        "Shanhua District",
        "Danei District",
        "Shanshang District",
        "Xinshi District",
        "Anding District"
      ],
      "Kaohsiung City": [
        "Xinxing District",
        "Qianjin District",
        "Lingya District",
        "Yancheng District",
        "Gushan District",
        "Qijin District",
        "Qianzhen District",
        "Sanmin District",
        "Nanzi District",
        "Xiaogang District",
        "Zuoying District",
        "Renwu District",
        "Dashe District",
        "Gangshan District",
        "Luzhu District",
        "Alian District",
        "Tianliao District",
        "Yanchao District",
        "Qiaotou District",
        "Ziguan District",
        "Mituo District",
        "Yong’an District",
        "Hunei District",
        "Fengshan District",
        "Daliao District",
        "Linyuan District",
        "Niaosong District",
        "Dashu District",
        "Qishan District",
        "Meinong District",
        "Liugui District",
        "Neimen District",
        "Shanlin District",
        "Jiaxian District",
        "Taoyuan District",
        "Namaxia District",
        "Maolin District",
        "Qieding District"
      ],
      "Pingtung County": [
        "Pingtung City",
        "Sandimen Township",
        "Wutai Township",
        "Majia Township",
        "Jiuru Township",
        "Ligang Township",
        "Gaoshu Township",
        "Yanpu Township",
        "Changzhi Township",
        "Linluo Township",
        "Zhutian Township",
        "Neipu Township",
        "Wandan Township",
        "Chaozhou Township",
        "Taiwu Township",
        "Laiyi Township",
        "Wanluan Township",
        "Kanding Township",
        "Xinpi Township",
        "Nanzhou Township",
        "Linbian Township",
        "Donggang Township",
        "Liuqiu Township",
        "Jiadong Township",
        "Xinyuan Township",
        "Fangliao Township",
        "Fangshan Township",
        "Chunri Township",
        "Shizi Township",
        "Checheng Township",
        "Mudan Township",
        "Hengchun Township",
        "Manzhou Township"
      ],
      "Taitung County": [
        "Taitung City",
        "Ludao Township",
        "Lanyu Township",
        "Yanping Township",
        "Beinan Township",
        "Luye Township",
        "Guanshan Township",
        "Haiduan Township",
        "Chishang Township",
        "Donghe Township",
        "Chenggong Township",
        "Changbin Township",
        "Taimali Township",
        "Jinfeng Township",
        "Dawu Township",
        "Daren Township"
      ],
      "Hualien County": [
        "Hualien City",
        "Xincheng Township",
        "Xiulin Township",
        "Ji’an Township",
        "Shoufeng Township",
        "Fenglin Township",
        "Guangfu Township",
        "Fengbin Township",
        "Ruisui Township",
        "Wanrong Township",
        "Yuli Township",
        "Zhuoxi Township",
        "Fuli Township"
      ],
      "Kinmen County": [
        "Jinsha Township",
        "Jinhu Township",
        "Jinning Township",
        "Jincheng Township",
        "Lieyu Township",
        "Wuqiu Township"
      ],
      "Lienchiang County": [
        "Nangan Township",
        "Beigan Township",
        "Juguang Township",
        "Dongyin Township"
      ],
      "Penghu County": [
        "Magong City",
        "Xiyu Township",
        "Wang’an Township",
        "Qimei Township",
        "Baisha Township",
        "Huxi Township"
      ],
      "Nanhai": [
        "Dongsha",
        "Nansha"
      ]
    }
  }

  var cityReferRegion = config.cityReferRegion || lang[locale]

  var finalConfig = {
    ...config,
    onValueSet(picker, value, displayValue) {


      var reObj = _.find(zipcodes, {
        county: value[0].replace(/’/g, "'"), /* zipcode data裡的標點符號不同 */
        city: value[1].replace(/’/g, "'") /* zipcode data裡的標點符號不同 */
      })

      returnObj.zipcode = reObj.zipcode

      oriOnValueSet(picker, value, displayValue)

    },
    picker: {
      cols: [
        {
          textAlign: "center",
          values: [
          ],
          onChange: function (picker, value, displayValue) {
            // 更新地區
            if (picker.cols[1].replaceValues !== undefined) {
              picker.cols[1].replaceValues(cityReferRegion[value])
            }
          },
        },
        {
          textAlign: "center",
          values: ["中正區", "大同區"],
        },
      ]
    }
  }

  // 第一個預設值
  finalConfig.picker.cols[0].values = Object.keys(cityReferRegion)
  finalConfig.picker.cols[1].values = cityReferRegion[finalConfig.picker.cols[0].values[0]]

  returnObj = createF7PickerVue(finalConfig)

  // 紀錄當前zipcode
  returnObj.zipcode = ''


  return returnObj
}

/**
 * 建立F7 picker Vue
 * @description 不依賴於Dom，且可重設值的F7 picker Vue版本
 * @param {Object} config 
 * @param {HTMLElement|Ref} config.triggerElement - 觸發picker開啟的元素
 * @param {Function} config.onValueSet - (新value被設定的callback) 
 * @param {Object} config.picker - (傳入f7 picker的設定值) 
 * 
 * @returns {ReactiveObject} return
 * @property {Object} return.picker - F7 picker
 * @property {Array} return.value - Reactive Picker Value 
 * @property {Array} return.displayValue - Reactive Picker DisplayValue 
 */
export function createF7PickerVue(config) {

  var oriOnValueSet = config.onValueSet || function () { }

  var returnObj = reactive({
    picker: {},
    value: [],
    displayValue: []
  })

  var finalConfig = {
    ...config,
    onValueSet(picker, value, displayValue) {

      returnObj.value = value
      returnObj.displayValue = displayValue

      oriOnValueSet(picker, value, displayValue)
    }
  }

  var picker = createF7Picker($.extend(true, {}, finalConfig))

  // 動態綁定觸發元素
  if (isRef(finalConfig.triggerElement)) {
    watch(() => finalConfig.triggerElement.value, () => {
      if (finalConfig.triggerElement.value) {
        finalConfig.triggerElement.value.addEventListener('click', () => {
          if (picker && picker.open) {
            picker.open()
          }
        })
      }
    }, { immediate: true })
  }

  watch(() => returnObj.value, () => {
    // 重設值時，生成新picker
    if (!returnObj.value || (Array.isArray(returnObj.value) && returnObj.value.length == 0)) {
      if (picker.initialized) {

        if (picker.destroy) {
          picker.destroy()
        }

        picker = createF7Picker($.extend(true, {}, finalConfig))
        returnObj.picker = picker
      }
    } else {
      picker.setValue(returnObj.value)
    }

  })

  returnObj.picker = picker

  return returnObj
}

/**
 * 建立F7 picker
 * @param {Object} config 
 * @param {HTMLElement|String} config.triggerElement - 觸發picker開啟的元素
 * @param {Function} config.onValueSet - (新value被設定的callback) 
 * @param {Object} config.picker - (傳入f7 picker的設定值) 
 * @returns {Object} F7 picker
 */
export function createF7Picker(config) {

  // 建立虛擬input
  var vInput = document.createElement('input')
  var f7PickerConfig = config.picker || {}
  var defaultValue = Array.isArray(f7PickerConfig.value) ? f7PickerConfig.value : ''

  f7PickerConfig.inputEl = vInput

  function onValueSet(picker, value, displayValue) {
    if ('function' === typeof config.onValueSet) {
      config.onValueSet(picker, value, displayValue)
    }
  }

  function getDisplayValueFromValue(value) {
    if (!value) return []
    if (!Array.isArray(value)) return []
    if (!f7PickerConfig.cols) return []
    if (!Array.isArray(f7PickerConfig.cols)) return []
    if (f7PickerConfig.cols.length !== value.length) return []

    return value.map(function (val, idx) {
      var resultVal = ''

      f7PickerConfig.cols[idx].values.some(function (colVal, idx) {
        if (colVal == val) {
          resultVal = f7PickerConfig.cols[idx].displayValues[idx]
        }
      })

      return resultVal
    })
  }

  function onTriggerElementClick() {
    if (!picker.destroyed) {
      picker.open()
    }
  }

  var picker = f7.picker.create(f7PickerConfig)

  if (defaultValue) {
    onValueSet(picker, defaultValue, getDisplayValueFromValue(defaultValue))
  }

  picker.on('change', function (picker, value, displayValue) {
    onValueSet(picker, value, displayValue)
  })

  /**
   * picker 銷毀後，取消監聽關聯的callback
   */
  picker.on('beforeDestroy', function () {
    if (config.triggerElement) {
      $(config.triggerElement).off('click', onTriggerElementClick)
    }
  })

  if ($(config.triggerElement).length) {
    $(config.triggerElement).on('click', onTriggerElementClick)
  }

  return picker
}

/**
 * 更新F7 Picker Cols
 * 
 * @param {Array} cols 
 * @property {F7ColumnObject} cols[0] 
 * @returns 
 */
export function updateF7PickerColsValues(cols, picker) {
  if (!cols) return
  if (!Array.isArray(cols)) return
  if (!picker.cols) return
  if (!Array.isArray(picker.cols)) return
  if (picker.cols.length !== cols.length) return

  cols.forEach((col, index) => {
    var oriValue = col.value
    var refPickerCol = picker.cols[index]
    var isSame = true

    if (col.values.length != refPickerCol.values.length) {
      isSame = false
    };

    col.values.some((val, index2) => {
      if (parseInt(val) != parseInt(refPickerCol.values[index2])) {
        isSame = false
        return true
      }
    })

    if (!isSame) {
      if (refPickerCol.replaceValues) {
        refPickerCol.replaceValues(col.values, col.displayValues)
      }

      // 新陣列包含舊值，舊自動訂為預設
      if (col.values.indexOf(parseInt(oriValue)) > -1) {
        refPickerCol.setValue(oriValue, 0)
      }
    }
  })
}

/**
 * 
 * @param {String} backUrl 
 * @param {Object} config 
 * @param {Object} config.options - f7 router.back options
 * @param {Function} config.pageAfterIn - pageAfterIn callback
 * 
 * @return {Promise}
 */
export function f7RouterBack(backUrl, config) {

  var config = config || {}

  return new Promise((resolve, reject) => {
    f7.view.main.router.once('pageAfterIn', function () {
      if ('function' === typeof config.pageAfterIn) {
        config.pageAfterIn()
        resolve()
      }
    })

    f7.view.main.router.back(backUrl, config.options || {})
  })

}

/**
 * F7 App 路由設定返回網址
 * @param {String} backUrl - 當返回時的網址
 * @param {String} toUrl -目前要去的網址
 * @param {Object} config - 設定
 * @param {Boolean} config.clearPreviousHistory - 清除前面的history
 * @param {Function} config.pageAfterIn - pageAfterIn callback
 * 
 * @return {Promise}
 */
export function setBackUrlAndNavigate(backUrl, toUrl, config) {
  var config = config || {}
  /**
   * 使用config.clearPreviousHistory = true的說明
   * 
   * 頁面1=>2=>3=>4
   * 
   * 當從頁面3進入4前使用setBackUrlAndNavigate後雖然原來的3已被替換為backUrl，且返回時能正確到達backUrl指定的頁面。
   * 但某些狀況下，例如進到4並返回到backUrl後，如果此時使用navigate('xxx', {reloadCurrent: true})，則再次按下返回時會錯誤
   * 返回2的頁面
   * 
   * 因此，如果3之前的頁面已無需保留history(例如backUrl是/時，通常之前的頁面已無需保留)，
   * 則請在使用setBackUrlAndNavigate時設定config.clearPreviousHistory
   */

  return new Promise((resolve, reject) => {
    if (config.clearPreviousHistory) {
      f7.view.main.router.clearPreviousHistory()
    }
    f7.view.main.router.updateCurrentUrl(backUrl)

    f7.view.main.router.once('pageAfterIn', function () {
      // 清掉f7前一頁
      f7.view.main.router.removePage($$('.page-previous'))

      if ('function' === typeof config.pageAfterIn) {
        config.pageAfterIn()
        resolve()
      }
    })

    f7.view.main.router.navigate(toUrl)
  })
}


/**
 * 經緯度取得地址
 * @param {Object} latLng 
 * @property {Number} latLng.lat 
 * @property {Number} latLng.lng 
 * @returns {Promise}
 */
export function latLngToAddress(latLng) {

  return new Promise((resolve, reject) => {

    if ("undefined" === typeof google) {

    }

    var geocoder = new google.maps.Geocoder()
    var googleLatLng = new google.maps.LatLng({
      lat: latLng.lat,
      lng: latLng.lng,
    })

    geocoder
      .geocode({ location: googleLatLng })
      .then((response) => {
        let result = ''

        if (response.results && response.results.length) {

          // 官方文件指出，result會是由最佳組合到最低組合排序。在此採用最佳組合
          let addressComponents = response.results[0].address_components

          // google 建議不要直接去parse formated_address
          // 而是採用自行組裝 address component的方式
          if (addressComponents) {
            let administrative_area_level_1 = ''
            let administrative_area_level_2 = ''
            let administrative_area_level_3 = ''
            let administrative_area_level_4 = ''
            let administrative_area_level_5 = ''
            let administrative_area_level_6 = ''
            let administrative_area_level_7 = ''
            let route = ''
            let street_number = ''

            addressComponents.forEach((obj) => {
              if (obj.types.indexOf('administrative_area_level_1') > -1) {
                administrative_area_level_1 = obj.long_name
              } else if (obj.types.indexOf('administrative_area_level_2') > -1) {
                administrative_area_level_2 = obj.long_name
              } else if (obj.types.indexOf('administrative_area_level_3') > -1) {
                administrative_area_level_3 = obj.long_name
              } else if (obj.types.indexOf('administrative_area_level_4') > -1) {
                administrative_area_level_4 = obj.long_name
              } else if (obj.types.indexOf('administrative_area_level_5') > -1) {
                administrative_area_level_5 = obj.long_name
              } else if (obj.types.indexOf('administrative_area_level_6') > -1) {
                administrative_area_level_6 = obj.long_name
              } else if (obj.types.indexOf('administrative_area_level_6') > -1) {
                administrative_area_level_7 = obj.long_name
              } else if (obj.types.indexOf('route') > -1) {
                route = obj.long_name
              } else if (obj.types.indexOf('street_number') > -1) {
                street_number = obj.long_name
              }
            })

            resolve({
              fullAddress: response.results[0].formatted_address,
              area: administrative_area_level_1 + administrative_area_level_2
            })
          }

        } else {

          console.log("No results found")
          reject("No results found")
        }
      })
      .catch((e, b) => {
        console.log("Geocoder failed due to: ", e, b)
        reject("Geocoder failed due to: ", e, b)
      })
  })
}


// 相片瀏覽
export const openPhotoBrowser = function (imgArr, idx) {
  var idx = idx || 0

  if (!imgArr) return

  var photoBrowser = f7.photoBrowser.create({
    photos: imgArr,
  })

  photoBrowser.open(idx)

  return photoBrowser
}
