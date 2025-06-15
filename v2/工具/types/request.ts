import type { I18nObj, I18nLang, Paginate } from './index'

export enum ApiCode {
  SUCCESS = 0,
  PHONE_VALIDATION_REQUIRED = 30000,
  PHONE_VALIDATION_REQUIRED2 = 30001,
  LOGIN_EXPIRED = 10001,
}

export interface ApiResponse<T = unknown, C = ApiCode> {
  paginate?: Paginate
  expect?: Record<string, unknown>[] | Record<string, unknown>
  code: C
  data: T
  message: string
}

export enum ChannelEnableStatus {
  /** 已審核 */
  ENABLED = 1,
  /** 審核中 */
  UNDER_PROCESS = 0,
  /** 已駁回 */
  REJECTED = 2,
}

export enum ChannelType {
  MARKET = 0,
  BANK = 1,
  USDT = 2,
}

export type Permission = {
  created_at: string
  guard_name: string
  id: number
  name: string
  pivot: {
    model_id: number
    model_type: string
    permission_id: number
  }
  updated_at: string
}

export type FinancesItem = {
  created_at: string
  typeTrans: string
  amountAlter: string
  amountOriginal: string
  amountChanged: string
  orderId: string
  note: string
  detailStatus: number
  detailStatusTrans?: string
}

export type GameLogItem = {
  id: number
  startTime: number
  endTime: number
  winLoseResult: string
  vendorId: string
  count: string
  rebate: string
  betAmount: string
  validAmount: string
}

export enum BankCardEnableStatus {
  /** 已審核 */
  ENABLED = 1,
  /** 審核中 */
  UNDER_PROCESS = 0,
  /** 已駁回 */
  REJECTED = 2,
}

export type BankCard = {
  aberrant: number
  aberrantTrans: string
  bankBranch: string
  /** 銀行代碼+名稱 */
  bankName: string
  /** 帳號 */
  bankNo: string
  bankOwner: string
  created_at: string
  enable: BankCardEnableStatus
  enableTrans: string
  id: string
  note: I18nObj
  type: ChannelType
  typeTrans: string
  updated_at: string
  userId: number
}

export type UsdtRateInfo = {
  usdtRate: number
}

/** 某個Level等級VIP的資訊 */
export type VipLevelRuleSetting = {
  level: number
  name: I18nObj
  shouldDeposit: string
  bet: string
  bonusBirth: {
    bonus: string
    bonusConditionMultiple: string
  }
  bonusMonthly: {
    bonus: string
    bonusConditionMultiple: string
    date: string
  }
  bonusWeekly: {
    bonus: string
    bonusConditionMultiple: number
    date: number
    hourLimit: string
    shouldDeposit: string
  }
  /** 會員銀行卡可綁定幾張 */
  cardLimit: string
  description: I18nObj
  freeWithdrawTimes: {
    times: string
    type: string
  }
  gameTypeRebate: {
    bonusCondition: number
    bonusMultiple: string
    typeId: number
  }[]
  image: {
    id: number
    path: string
  }
  shouldPlay: string
}

export type ActivityItem = {
  position: number
  image: {
    id: number
    path: string
  }
  name: {
    [key: string]: string
  }
  bonus: string
  bonusConditionMultiple: number
}

export namespace Api {
  export namespace Login {
    export namespace Post {
      export type Request = {
        username: string
        password: string
      }
      export type Response = ApiResponse<{
        access_token: string
        expires_at: string
        google2FA: boolean
        role_name: string
      }>
    }
  }
  export namespace Register {
    export namespace Post {
      export type Request = {
        agentId?: string
        username: string
        password: string
        password_confirmation: string
      }
      export type Response = ApiResponse<{
        username: string
        password: string
      }>
    }
  }
  export namespace ForgetPwd {
    export namespace Post {
      export type Request = {
        username: string
        phone: string
        password: string
        password_confirmation: string
      }
      export type Response = ApiResponse
    }
  }
  export namespace GetOtp {
    export namespace Get {
      export type Request = {
        username: string
        phone: string
        smsCode?: string
      }
      export type Response = ApiResponse
    }
  }
  export namespace SetOtp {
    export namespace Post {
      export type Request = {
        username: string
        phone: string
        smsCode: string
      }
      export type Response = ApiResponse<{
        token: string
      }>
    }
  }
  export namespace Rate {
    export namespace Get {
      export type Response = ApiResponse<UsdtRateInfo>
    }
  }
  export namespace WithdrawRate {
    export namespace Get {
      export type Response = ApiResponse<UsdtRateInfo>
    }
  }
  export namespace Self{
    export namespace Get {
      export enum VipFreeTimeType {
        TODAY = 0,
        THIS_MONTH,
        THIS_WEEK,
      }
      export type Response = ApiResponse<{
        agId: number
        balance: string
        username: string
        bankCardCount: number
        birthdayFull: string
        vipFreeTimeType: VipFreeTimeType
        canFreeTimes: number
        canWithdraw: number
        created_at: string
        city: string
        area: string
        email: string
        enableBankCardCount: number
        enable_2fa: number
        favoriteGames: string[]
        id: number
        isOnline: number
        /**
         * 是否已實名驗證。用來判斷是否需驗證身分證
         * @example
         * true: 已實名
         * false: 未實名
         */
        isRealName: boolean
        lastLogin: string
        level: unknown[]
        levelId: number
        locked: number
        name: string
        phone: string
        nickname: string
        unreadMessage: number
        vipLevelImg: string
        phoneIsVerified: number
      }>
    }
  }
  export namespace VipLevelRules {
    export namespace Get {
      export type Response = ApiResponse<VipLevelRulesInfo>
    }
    export type VipLevelRulesInfo = {
      description: I18nObj
      /** 各等級VIP的資訊 */
      setting: VipLevelRuleSetting[]
    }
  }
  export namespace VipLevelCurrentInfo {
    export namespace Get {
      export type Response = ApiResponse<VipeLeventCurrentInfoItem>
    }
    export type VipeLeventCurrentInfoItem = {
      canFreeTimes: number
      currentVipLevel: VipLevelRuleSetting
      depositAmount: string
      levelId: number
      memberId: number
      nextVipLevel: VipLevelRuleSetting
      validBetAmount: string
      vipFreeTimes: string
    }
  }
  export namespace BankCard{
    export namespace Get {
      export type Response = ApiResponse<BankCard[]>
    }
  }
  export namespace AdSettings{
    export namespace Get {
      export type Request = {
        type: AdType
      }
      export type Response = ApiResponse<AdvertisementsData[]>
    }
    export enum AdType {
      /** 輪播 */
      BANNER = 0,
      /** 彈窗 */
      POPUP = 1,
    }
    export enum AdvertisementPosition {
      /** 登入前 */
      BEFORE_LOGIN = 0,
      /** 登入後 */
      AFTER_LOGIN,
      /** 廣告頁(not login) */
      AD_PAGE,
      /** 倒數 */
      TIMEOUT,
      /** 跳轉 */
      REDIRECT,
    }
    export interface AdvertisementsData {
      endAt: null | string
      eventCode: null | string
      link: null | string
      mobileImage: {
        [key in I18nLang]?: {
          id: null | number
          path: null | string
          url: null | string
        }
      }
      pcImage: {
        [key in I18nLang]?: {
          id: null | number
          path: null | string
          url: null | string
        }
      }
      position: null | AdvertisementPosition
      showSeconds: number
      startAt: null
      status: 1 | 0
      title: I18nObj
      type: AdType
    }
  }
  export namespace GetMenu{
    export namespace Get {
      export type Response = ApiResponse<GetMenuItem[]>
    }
    export type GetMenuItem = {
      enable: number
      id: number
      masterEnable: number
      order: number
      platforms: {
        enable: number
        id: number
        img: string
        logo: string
        masterEnable: number
        order: number
        platform: string
      }[]
      type: string
      typeName: I18nObj
    }
  }
  export namespace Anns{
    export namespace Get {
      export type Response = ApiResponse<AnnsItem[]>
    }
    export type AnnsItem = {
      content: I18nObj
      startAt: string
      stopAt: string
      title: I18nObj
      type: EnumAnnsType
    }
    export enum EnumAnnsType {
      MAQQUEE = 0,
      WEBSITE = 1,
    }
  }
  export namespace GameList{
    export namespace Get {
      export type Response = ApiResponse<GameListItem[]> & {
        except: {
          new: string[]
          popular: string[]
        }
      }
    }
    export type GameListItem = {
      enable: number
      game: string
      gameName: I18nObj
      id: string
      img: string
      mobile: string
      order: number
      pc: number
      platformName: string
      type: string
      vendor: string
    }
  }
  export namespace Pages {
    export namespace Get {
      export type Response = ApiResponse<PagesItem>
    }
    export type PagesItem = {
      banner: Banner[]
      faq: Faq[]
      logo: Logo
      shortcut: Shortcut[]
      userAgreement: I18nObj
    }
    export type Banner = {
      bannerId: number
      bigImg: string
      eventCode: string
      eventId: number
      eventTitle: I18nObj
      img: I18nObj<{
        bigImg: { id: number, path: string, url: string }
      }>
      link: string
      smallImg: string
    }
    export type Faq = I18nObj<{
      title: string
      content: string
    }[]>
    export type Logo = {
      mobile: {
        id: number
        url: string
      }
      web: {
        id: number
        url: string
      }
    }
    export type Shortcut = {
      color: string
      desc: I18nObj
      enable: boolean
      href: I18nObj
      icon: string
      name: I18nObj
      type: string
    }
  }
  export namespace Events {
    export namespace Get {
      export type Response = ApiResponse<EventsItem[]> & {
        except: {
          totalUnclaimedCount?: number
        }
      }
    }
    export type EventsItem = {
      unclaimedCount?: number
      content: I18nObj
      eventCode: string
      title: {
        banner: {
          [key: string]: {
            bigImg: {
              id: string
              path: string
            }
            smallImg: {
              id: string
              path: string
            }
          }
        }
        [key: string]: unknown
      }
      dateBetween: [string, string]
      timeBetween: [string, string]
      userHasEvents: UserEvent[]
      [key: string]: unknown
    }
    export type UserEvent = {
      canFetch: string
      status: string
      statusTrans: string
      orderId: string
      rewardId: string
      fetchAt: string
      amount: string
    }
  }
  export namespace Deposit {
    export namespace Post {
      export type Request = {
        amount: number
        channelId: string
        cardId?: string
        area?: string
        city?: string
      }
      export type Response = ApiResponse<{
        view_type: 'Market' | 'Bank' | 'USDT'
        transaction_id: string
        order_id: string
        bank_from: string
        bank_name: '7-11' | '全家' | '萊爾富' | 'OK'
        bank_no: string
        bank_owner: string
        bill_price: string
        expired: string
        payment_code: string
        real_price: string
        /** usdt儲值對應的台幣金額 */
        order_amount: string
      }>
    }
    export namespace Get {
      export type Request = {
        page: number
        orderId: string
        start: string
        end: string
      }
      export type Response = ApiResponse<DepositRecordItem[]>
      export type DepositRecordItem = {
        orderId: string
        updated_at: string
        created_at: string
        date: string
        status: DepositRecordItemStatusType
        statusTrans: string
        title: string
        feeMember: string
        type: string
        amount: string
        amountAsync: string
      }
      export enum DepositRecordItemStatusType {
        default = 0,
        success,
        warning,
        info,
        danger,
      }
    }
  }
  export namespace SelfUpdate {
    export namespace Put {
      export type Request = {
        name?: string
        nickname?: string
        birthdayFull?: string
      }
      export type Response = ApiResponse<ResponseMessage>
      export type ResponseMessage = string
    }
  }
  export namespace Password {
    export enum PasswordChangeStatus {
      SUCCESS = 0,
      PHONE_VALIDATION_REQUIRED = 30000,
      PHONE_VALIDATION_REQUIRED2 = 30001,
    }
    export namespace Put {
      export type Request = {
        old_password: string
        new_password: string
        smsToken: string
        phone: string
      }
      export type Response = ApiResponse<null, PasswordChangeStatus>
    }
  }
  export namespace Finances {
    export namespace Get {
      export type Request = {
        page: number
        types?: string[]
        start: string
        end: string
      }
      export type Response = ApiResponse<{
        data: FinancesItem[]
        paginate: Paginate
        except?: {
          type?: string[]
        }
      }>
    }
  }
  export namespace GameLogs {
    export namespace Get {
      export type Request = {
        page: number
        vendorId?: string
        startTime: string
        endTime: string
      }
      export type Response = ApiResponse<{
        data: GameLogItem[] | []
        paginate: Paginate
        except: Record<string, unknown>
      }>
    }
  }
  export namespace PromotionalReleaseRecords {
    export namespace Put {
      export type Request = {
        orderId: string
      }
      export type Response = ApiResponse<null>
    }
  }
  export namespace SmsEvents {
    export namespace Get {
      export type Request = null
      export type Response = ApiResponse<{
        memberRegister: number
        memberUpdatePhone: number
      }>
    }
  }

  export namespace UpdatePhone {
    export namespace Get {
      export type Request = {
        phone: string
        smsToken: string
      }
      export type Response = ApiResponse<null>
    }
  }

  export namespace Withdraw {
    export namespace Get {
      export type Request = {
        page: number
        orderId: string
        start: string
        end: string
      }
      export type Response = ApiResponse<WithdrawRecordItem[]>
      export type WithdrawRecordItem = {
        amount: string
        bankBranch: string
        bankBranchCode: string
        bankName: string
        bankNo: string
        bankOwner: string
        created_at: string
        feeMember: string
        memberId: number
        orderId: string
        rate: string
        status: number
        statusTrans: string
        type: number
        updated_at: string
      }
    }
  }
  export namespace QueryBalance {
    export namespace Get {
      export type Request = VendorName
      export type Response = ApiResponse<BalanceInfo>
      export type BalanceInfo = {
        balance: string
      }
      export type VendorName = string
    }
  }
  export namespace GameRankDateRange {
    export namespace Get {
      export type Request = null
      export type Response = ApiResponse<GameRankDateRangeItem>
      export type GameRankDateRangeItem = {
        [key: string]: {
          startTime: string
          endTime: string
        }
      }
    }
  }
  export namespace GameRankSetting {
    export namespace Get {
      export type Request = null
      export type Response = ApiResponse<GameRankSettingItem>
      export type GameRankSettingItem = {
        live?: ActivityItem[] | null
        egame?: ActivityItem[] | null
      }
    }
  }
  export namespace GameRankList {
    export namespace Get {
      export type Request = null
      export type Response = ApiResponse<GameRankListItem>
      export type GameRankListItem = {
        lastTime: string
        selfRank: {
          egame: GameRankItem
          live: GameRankItem
        }
        today: {
          egame: GameRankItem[]
          live: GameRankItem[]
        }
        yesterday: {
          egame: GameRankItem[]
          live: GameRankItem[]
        }
      }
      export type GameRankItem = {
        bonus: string
        image: {
          id: number
          path: string
        }
        levelId: number
        memberId: number
        name: string
        position: number
        validAmount: number
      }
    }
  }
  export namespace GameRankRecord {
    export namespace Get {
      export type Request = null
      export type Response = ApiResponse<GameRankRecordItem>
      export type GameRankRecordItem = {
        lastMonthRankRewardRecord: GameRankRecordItemDetail[]
        lastTime: string
        selfRankRewardRecord: {
          rank: number
          firstCount: string
          secondCount: string
          thirdCount: string
          otherCount: string
        }
        thisMonthRankRewardRecord: GameRankRecordItemDetail[]
      }
      export type GameRankRecordItemDetail = {
        firstCount: string
        levelId: number
        name: string
        otherCount: string
        point: string
        position: number
        secondCount: string
        thirdCount: string
      }
    }
  }
  export namespace IdCard {
    export namespace Get {
      export type Request = null
      export type Response = ApiResponse<Item>
      export type Item = {
        /** 0:未上傳或失敗 1:審核中 2:已通過 */
        realNameStatus: 0 | 1 | 2
        realNameStatusTrans: I18nObj
        bankCards: (BankCard & {
          images: {
            cardId: string
          }[]
        })[]
      }
    }
  }
}

export namespace SmsApi {
  export namespace Otp {
    export namespace Get {
      export type Request = null
      export type Response = ApiResponse<null>
    }
    export namespace Post {
      export type Request = {
        smsCode: string
      }
      export type Response = ApiResponse<{
        token: string
      }>
    }
  }
}

export namespace DepositApi {
  export namespace Channels {
    export namespace Get {
      export type Request = null
      export type Response = ApiResponse<DepositChannelItem[]>
      export type DepositChannelItem = {
        id: string
        depositDesc: I18nObj
        displayName: I18nObj
        type: ChannelType
        lower: string
        upper: string
        feeEachMember: string
        feeRateMember: string
        suggestion: string
        status: ChannelEnableStatus
      }
    }
  }
}

export namespace WithdrawApi {
  export namespace Channels {
    export namespace Get {
      export type Request = null
      export type Response = ApiResponse<WithdrawChannelItem[]>
      export type WithdrawChannelItem = {
        id: string
        depositDesc: I18nObj
        displayName: I18nObj
        type: ChannelType
        lower: string
        upper: string
        feeEachMember: string
        feeRateMember: string
        suggestion: string
        status: ChannelEnableStatus
      }
    }
    export namespace Post {
      export type Request = {
        amount: number
        channelId: string
        cardId: string
        feeCheck: boolean
      }
      export type Response = ApiResponse<null>
    }
  }

  export namespace Conditions {
    export namespace Get {
      export type Request = {
        page: number
      }
      export type Response = ApiResponse<WithdrawConditionItem[]>
      export type WithdrawConditionItem = {
        amount: string
        amountCondition: string
        amountValid: string
        betIdEnd: string
        betIdStart: string
        created_at: string
        details: unknown[]
        eventId: number
        id: number
        memberId: number
        orderId: string
        status: number
        statusTrans: string
        type: number
        typeTrans: string
        updated_at: string
      }
    }
  }
}

export namespace GamesApi {
  export namespace Logout {
    export namespace Post {
      export type Request = {
        all?: 1
      }
      export type Response = ApiResponse<null>
    }
  }
  export namespace Vendors {
    export namespace Get {
      export type Request = null
      export type Response = ApiResponse<{
        [index: string]: VendorName
      }>
      export type VendorName = string
    }
  }
}

export namespace AvApi {
  export type Actor = {
    id: number
    name: string
  }

  export type Tag = {
    id: number
    name: string
  }
  export namespace Recommend {
    export namespace Post {
      export type Request = null
      export type Response = ApiResponse<RecommendItem[]>
      export type RecommendItem = {
        id: number
        path: string
        title: string
      }
    }
  }
  export namespace Video {
    export namespace Post {
      export type Request = null
      export type Response = ApiResponse<VideoItem>
      export type VideoItem = {
        id: number
        actors: Actor[]
        height: number
        path: string
        public_at: string
        seconds: number
        tags: Tag[]
        title: string
        videws: number
        avcode: string
      }
    }
  }
  export namespace Tags {
    export namespace Post {
      export type Request = {
        page: number
      }
      export type Response = ApiResponse<{
        prevPageUrl: string
        nextPageUrl: string
        data: TagItem[]
      }>
      export type TagItem = {
        id: number
        name: string
        videosCount: string
      }
    }
  }
  export namespace Actors {
    export namespace Post {
      export type Request = {
        page: number
      }
      export type Response = ApiResponse<{
        prevPageUrl: string
        nextPageUrl: string
        data: ActorItem[]
      }>
      export type ActorItem = {
        id: number
        name: string
        videosCount: string
      }
    }
  }
}
