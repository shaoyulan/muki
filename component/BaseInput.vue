<template>
  <div
    ref="refEl"
    class="base-input form-group"
    :class="[
      {
        'base-input_select': select,
        'base-input_gray-bg': grayBg,
        'base-input_radius': radius,
        'base-input_show-append': showAppend,
        'base-input_show-prepend': showPrepend,
      },
      'base-input_float-2pend',
      isInputFocused ? 'base-input_focused' : null,
      isHasValue ? 'is-has-value' : null,
      skewLabel ? 'sty-skew-label' : null,
      textCenter ? 'sty-text-center' : null,
      inputPreventActive ? 'sty-input-prevent-active' : null
    ]"
    :style="{
      '--base-input-height': h ? h : null,
      '--base-input-font-size': fz ? fz : null,
      '--base-input-icon-size': iconSize ? iconSize : null,
    }"
  >
    <slot name="root-start" />

    <label
      v-if="labelName"
      for=""
    >
      <div class="skew-label">
        <div class="skew-label-caret" />
      </div>
      <span class="label-txt">
        {{ labelName }}
      </span>
      <span
        v-if="star == 'star-before'"
        class="star-before"
      >*</span>
      <span
        v-if="star == 'star-after'"
        class="star-after"
      >*</span>
    </label>

    <template v-if="!custom">
      <div class="input-group">
        <div
          v-if="showPrepend"
          class="input-group-prepend"
        >
          <slot name="input-group-prepend" />
          <i
            v-if="icon && !iconAppend"
            class="icon"
            :class="icon"
          />
        </div>
        <div class="input-wrap">
          <template v-if="inputTag !== 'div'">
            <component
              :is="inputTag"
              ref="refInput"
              class="input-el"
              :value="(modelValue !== undefined && modelValue !== null && modelValue !== '') ? modelValue : (refInput ? refInput.value : '')"
              :id="inputId"
              :name="name"
              :type="thisType"
              :inputmode="inputmode"
              :class="inputClass"
              @input="$emit('update:modelValue', $event.target.value)"
              :readonly="readonly || select ? true : null"
              @blur="$emit('blur')"
              :disabled="disabled ? true : null"
              @focus="$emit('focus')"
              :rows="inputTag == 'textarea' ? rows : null"
              :placeholder="placeholder"
              autocomplete="off"
            />
          </template>
          <template v-if="inputTag == 'div'">
            <div>
              {{ (modelValue !== undefined && modelValue !== null && modelValue !== '') ? modelValue : (refInput ?
                refInput.value : '') }}
            </div>
          </template>
          <!-- <div class="custom-placeholder" v-if="placeholder && (modelValue === '' || modelValue === undefined || modelValue === null) " >
                <div class="custom-placeholder-content" v-html="placeholder"></div>
            </div> -->
        </div>
        <div
          v-if="showAppend"
          class="input-group-append"
        >
          <slot name="input-group-append" />
          <!-- select 箭頭 -->
          <!-- <i v-if="isSelect" class="select-icon icon-down-arrow"></i> -->
          <i
            v-if="icon && iconAppend"
            class="icon"
            :class="icon"
          />

          <!-- password icon-->
          <!-- <div v-if="isPassword && !noPasswordToggler" class="password-tools" @click="togglePwd">
                <i v-if="isPassword && thisType == 'password' " class="fa fa-eye" aria-hidden="true"></i>
                <i v-if="isPassword && thisType !== 'password' " class="fa fa-eye-slash" aria-hidden="true"></i>
            </div> -->
          <!-- password ion /-->

          <!-- 必填badge -->
          <span
            v-if="requiredBadge && errors.indexOf('必填') > -1"
            class="badge required-badge"
          >
            必填
          </span>
          <!-- 必填badge / -->

          <!-- 正確icon -->
          <i
            v-if="successIndicator && meta.valid && (modelValue !== '')"
            class="valid-icon icon-yes"
          />
          <!-- 正確icon /-->
        </div>
      </div>
    </template>

    <span
      v-if="(errMsg || thisErrMsg) && !noSubErrMsg"
      class="error-msg"
      :name="name"
    >{{ errMsg ? errMsg :
      thisErrMsg }}</span>
    <slot name="root-end" />
  </div>
</template>

<script>
import { ref, watch, computed, nextTick, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useField, ErrorMessage } from 'vee-validate'

export default {
  components: {
  },
  props: {
    modelValue: {
      default: "",
    },
    labelName: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    select: Boolean,
    type: {
      type: String,
      default: "",
    },
    inputmode: {
      type: String,
      default: 'text'
    },
    star: {
      // 必填星星
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    inputId: {
      type: String,
      default: "",
    },
    inputTag: {
      default: 'input',
    },
    inputClass: String,
    readonly: Boolean,
    disabled: Boolean,
    requiredBadge: Boolean,
    inputPreventActive: Boolean,

    // icon
    icon: {
      type: String,
      default: "",
    },
    iconAppend: Boolean,
    // icon /

    // 高度
    h: {
      type: [String],
      default: '',
    },
    // 高度 /

    // 字體大小
    fz: {
      type: [String],
      default: '',
    },
    iconSize: {
      type: [String],
      default: '',
    },
    // 字體大小 /

    // textarea
    rows: {
      type: Number,
      default: 5,
    },
    // textarea /

    // password
    noPasswordToggler: Boolean,
    // password /

    // skewLabel
    skewLabel: Boolean,
    // skewLabel /

    // text center
    textCenter: Boolean,
    // text center /

    // success indicator
    successIndicator: Boolean,
    // success indocator /

    // tippyMsg
    tippyMsg: String,
    // tippyMsg /

    // validate
    errMsg: {
      type: String,
      default: "",
    },
    // 不顯示下方 errMsg
    noSubErrMsg: Boolean,

    // 種類
    custom: Boolean,
    password: Boolean,
    customControl: Boolean,
    address: Boolean,

    // 自訂
    grayBg: Boolean,
    radius: Boolean
  },
  emits: ['update:modelValue', 'blur', 'baseInput'],
  setup(props, { emit, slots }) {


    const { sty, name, type } = props

    const refEl = ref(null)
    const refInput = ref(null)

    let thisType = ref(type)
    const isHasValue = ref(false)
    const isInputFocused = ref(false)

    const showPrepend = computed(() => {
      return slots['input-group-prepend'] || (props.icon && !props.iconAppend)
    })

    const showAppend = computed(() => {
      return slots['input-group-append'] || props.select || props.password || (props.icon && props.iconAppend)
    })

    // password
    const togglePwd = () => {
      if (thisType.value == 'password') {
        thisType.value = 'text'
      } else {
        thisType.value = 'password'
      }

      refInput.value.focus()
    }
    // password /

    // 提示訊息
    let tippyInstace = {}


    const showTippy = () => {
      if (tippyInstace) {
        tippyInstace.show()
      }
    }

    const hideTippy = () => {
      if (tippyInstace) {
        tippyInstace.hide()
      }
    }

    onMounted(() => {

      // custom 的情況下 refInput 會是空的
      if (!refInput.value) return

      watch(() => props.modelValue, () => {
        if (props.modelValue !== '' && props.modelValue !== null && props.modelValue !== undefined) {
          isHasValue.value = true

        } else {
          isHasValue.value = false
          refInput.value = ''
        }
      })

      refInput.value.addEventListener('focus', () => isInputFocused.value = true)
      refInput.value.addEventListener('blur', () => isInputFocused.value = false)


      // 注意 : baseInput 若加上 disable 則Tippy 會無法顯示
      if ('function' === typeof tippy) {
        tippyInstace = tippy(refEl.value, {
          // default
          placement: 'bottom-end',
          trigger: 'manual',
          appendTo: refEl.value,
          content: props.tippyMsg,
        })
      }

      emit('baseInput', {
        showTippy: showTippy,
        hideTippy: hideTippy,
      })

    })
    // 提示訊息 /

    // validate
    const {
      errorMessage: thisErrMsg,
      name: thisName,
      value,
      meta,
      errors,
      resetField,
      validate,
      handleChange,
      handleBlur,
      setValidationState,
      checked,
    } = useField(name)

    onMounted(() => {

    })

    return {
      console,
      refEl,
      refInput,
      thisType,
      isHasValue,
      isInputFocused,

      meta,
      errors,
      checked,
      thisErrMsg,

      // password
      togglePwd,

      showPrepend,
      showAppend
    }
  },
}
</script>

<style lang="scss">
@import '@design';

@mixin base-input__custom-place-holder {

  .input-with-value~.custom-placeholder {
    opacity: 0;
  }

  .input-wrap {
    position: relative;
  }

  .custom-placeholder {
    font-size: var(--base-input-font-size);
    color: var(--base-input-placeholder-color);
    @include absolute(0, 0, 0, 0);
    pointer-events: none;
    display: flex;
    align-items: center;
  }
}

@mixin base-input__sty-round-bar {
  --base-input-border-width: 2px;
  --icon-center-mt: calc(var(--half-base-input-height) - var(--half-base-input-icon-size) - var(--half-icon-size-and-font-size-diff) - 7px);

  .input-group {
    background: #fff;
    border: 2px solid #D8D8D8;
    border-radius: 28px;
    padding: 5px 32px;

    textarea,
    input,
    select {
      height: calc(var(--base-input-height) - (var(--base-input-border-width) * 2) - 10px);
    }
  }
}

@mixin base-input_sty_shadow-bar {
  --base-input-placeholder-color: #A8A8A8;

  &:focus-within {
    .input-group {
      box-shadow: 0 0 0 #0025BB1A;

      &:after {
        border: 1px solid #7FDDFF;
      }
    }
  }

  .input-group {
    display: flex;
    background: #fff;
    border-radius: 10px;
    padding: 0 var(--base-input-horizontal-padding);
    position: relative;
    box-sizing: border-box;
    box-shadow: 0 5px 15px #0025BB1A;
    transition: border .3s, box-shadow .3s;

    .icon {
      color: #658bc8;
      margin-right: 0;
      transition: .3s;
    }

    &::after {
      content: '';
      display: block;
      @include absolute(0, 0, 0, 0);
      pointer-events: none;
      border-radius: 10px;
    }

    .input-group-prepend,
    .input-group-append {
      height: var(--base-input-height);
    }
  }
}

@mixin base-input_sty_outline-bar {
  --base-input-placeholder-color: #A8A8A8;

  &:focus-within {
    .input-group {
      border: 1px solid #7FDDFF;
    }
  }

  .input-group {
    display: flex;
    background: #fff;
    border-radius: 10px;
    padding: 0 var(--base-input-horizontal-padding);
    position: relative;
    box-sizing: border-box;
    transition: border .3s;
    border: 1px solid #E9EDF9;

    .icon {
      color: #658bc8;
      margin-right: 0;
      transition: .3s;
    }

  }

  label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
  }
}

@mixin base-input_sty_password {
  .password-tools {
    cursor: pointer;

    i {
      color: #a8a8a8;
    }
  }
}

@mixin base-input_sty_select {
  position: relative;

  .input-group {
    &:after {
      content: '';
      display: block;
      @include icomoon('\e909');
      font-size: 12px;
      display: inline-block;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%) scale(calc(11 / 12));
      // transform-origin: center right;
      transition: .3s;
      color: #7E828D;
    }
  }

  input,
  select,
  textarea {
    cursor: pointer;
  }
}

// 專案
.base-input {
  &_ultra {
    --base-input-height: #{rwd-val(320px, 50px, 1920px, 75px)} !important;
    --base-input-font-size: #{rwd-val(320px, 18px, 1920px, 20px)} !important;
    --base-input-icon-size: #{rwd-val(320px, 20px, 1920px, 26px)} !important;

    @include media(1920) {
      --base-input-height: #{rwd-val(320px, 50px, 1920px, 75px)} !important;
      --base-input-font-size: #{rwd-val(320px, 18px, 1920px, 20px)} !important;
      --base-input-icon-size: #{rwd-val(320px, 20px, 1920px, 26px)} !important;
    }

    @include media(320) {
      --base-input-height: 50px !important;
      -base-input-font-size: 18px !important;
      -base-input-icon-size: 20px !important;
    }
  }
}

// 專案 /

.base-input {
  --base-input-height: 40px;
  --base-input-border-width: 0px;
  --base-input-icon-size: 18px;
  --base-input-badge-size: 20px;
  --base-input-font-size: 14px;
  --base-input-color: #000000;
  --base-input-placeholder-color: #7E828D;
  --base-input-horizontal-padding: calc(34 / 20 * var(--base-input-font-size));
  --base-input-bg: #fff;
  --base-input-radius: 0px;
  --base-input-hpadding: 10px;
  --base-input-vpadding: 10px;
  --base-input-append-width: 30px;
  --base-input-preppend-width: 30px;
  --base-input-caret-color: #000000;
  --base-input-border-color: #fff;

  --half-base-input-height: calc(var(--base-input-height) / 2);
  --half-base-input-icon-size: calc(var(--base-input-icon-size) / 2);

  // icon 置中用
  --half-icon-size-and-font-size-diff: calc((var(--base-input-icon-size) - var(--base-input-font-size)) / 2 * 1.5);
  // icon 要置中需要的 margin值
  --icon-center-mt: calc(var(--half-base-input-height) - var(--half-base-input-icon-size));
  // icon 置中用 /

  // badge 置中用
  --half-badge-size-and-font-size-diff: calc((var(--base-input-badge-size) - var(--base-input-font-size)) / 2 * 1.5);
  // badge 要置中需要的 margin值
  --badge-center-mt: calc(var(--half-base-input-height) - var(--half-base-input-icon-size) - var(--half-icon-size-and-font-size-diff));
  // badge 置中用 /

  margin-bottom: 20px;
  font-family: $ff-msjh;
  font-size: var(--f7-font-size);


  input,
  select,
  textarea {
    box-sizing: border-box;
    width: 100%;
    flex-shrink: 1;
    flex-grow: 1;
    border: 0;
    padding: var(--base-input-vpadding) var(--base-input-hpadding);
    font-size: var(--base-input-font-size);
    color: var(--base-input-color);
    background: var(--base-input-bg);
    border-radius: var(--base-input-radius);
    caret-color: var(--base-input-caret-color);

    &:focus,
    &:active {
      outline: none;
    }
  }

  input,
  select {
    height: calc(var(--base-input-height) - (var(--base-input-border-width) * 2));
  }

  input,
  textarea {
    &::placeholder {
      color: var(--base-input-placeholder-color);
      letter-spacing: calc(2 / 20 * 1em);
    }
  }

  textarea {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
  }

  .input-group {
    display: flex;
    flex-wrap: nowrap;

    &:before {
      content: '';
      display: block;
      @include absolute(0, 0, 0, 0);
      border: 2px solid var(--base-input-border-color);
      z-index: 2;
      pointer-events: none;
      border-radius: 5px;
    }
  }

  .input-wrap {
    flex-grow: 1;
  }

  .input-group-prepend,
  .input-group-append {
    i {
      display: block;
      font-size: var(--base-input-icon-size);
      margin-top: var(--icon-center-mt);
      color: var(--base-input-icon-color);
    }
  }

  .input-group-prepend {
    margin-right: calc(23 / 20 * var(--base-input-font-size));
  }

  .input-group-append {
    margin-left: 10px;
  }

  .label-txt {
    font-size: var(--base-input-font-size);
  }

  @include base-input__custom-place-holder;

  .base-input_pd_10px & {
    --base-input-horizontal-padding: 10px;
  }

  &.sty-input-prevent-active {
    .input-wrap {
      position: relative;

      &:after {
        content: '';
        display: block;
        @include absolute(0, 0, 0, 0);
      }
    }
  }

  &.sty-round-bar {
    @include base-input__sty-round-bar;
  }

  &.sty-text-center {

    input,
    textarea,
    select,
    .custom-placeholder {
      text-align: center;
      justify-content: center;
    }
  }

  &.sty-skew-label {
    label {
      position: relative;
      padding: 0px 9px;
      padding-right: 20px;
      color: #fff;
      font-size: calc(12 / 14 * 1rem);
      letter-spacing: calc(3 / 12 * 1em);
      min-height: calc(20 / 14 * 1rem);
      display: inline-flex;
      align-items: center;
      margin-bottom: 5px;
    }

    .skew-label {
      @include absolute(0, 20px, 0, 0);
      background: rgba(#333333, 0.2);

      .skew-label-caret {
        width: calc(20 / 14 * 1rem);
        height: calc(20 / 14 * 1rem);

        &:before {
          content: '';
          display: block;
          padding-top: 100%;
        }

        position: absolute;
        left: 100%;
        top: 0;
        bottom: 0;
        background-repeat: no-repeat;
        background: linear-gradient(45deg, rgba(#333333, 0.2) 0 50%, #fff 50.1%);
      }
    }

    .label-txt {
      margin-right: 5px;
      position: relative;
      color: #fff;
      line-height: 1;
    }
  }

  &.sty-shadow-bar {
    @include base-input_sty_shadow-bar;
  }

  &.sty-password {
    @include base-input_sty_password;
  }

  &_show-append {

    input,
    select,
    textarea {
      padding-right: var(--base-input-append-width);
    }
  }

  &_show-prepend {

    input,
    select,
    textarea {
      padding-right: var(--base-input-prepend-width);
    }
  }

  &_float-2pend {

    .input-group-prepend,
    .input-group-append {
      position: absolute;
      top: 0;
      bottom: 0;
    }

    .input-group-prepend {
      left: 0;
      padding-left: var(--base-input-hpadding);
    }

    .input-group-append {
      right: 0;
      padding-right: var(--base-input-hpadding)
    }
  }

  &_select {
    @include base-input_sty_select;
  }

  // 星星
  .star-before,
  .star-after {
    position: absolute;
    color: #FF7589;
  }

  .star-before {
    right: 100%;
  }

  .star-after {
    left: 100%;
  }

  // 星星 /


  // 其他
  .tippy-box {
    background: none;

    .tippy-arrow {
      left: 50% !important;
      transform: translateX(-50%) !important;
      color: rgba(#000, 0.8) !important;
    }

    [data-placement^=bottom]>.tippy-arrow:before {
      border-width: 0 5px 7px;
    }

    .tippy-content {
      background: rgba(#000, 0.8) !important;
      border-radius: 4px;
      letter-spacing: 0.1em;
      padding: 5px 18px;
    }
  }

  .valid-icon {
    --base-input-icon-size: 19px;

    display: inline-block;
    font-size: var(--base-input-icon-size);
    color: #4de3b1;
    margin-top: var(--icon-center-mt)
  }

  // 其他 /

  &_gray-bg {
    --base-input-bg: #E2E2E2;
    --base-input-border-color: #E2E2E2;
  }

  &_radius {
    --base-input-radius: 5px;
  }

  &_focused {
    --base-input-caret-color: #E85252;
    --base-input-border-color: #E85252;
    --base-input-bg: #fff;

    .input-group-prepend,
    .input-group-append {
      i {
        color: #E85252;
      }
    }
  }
}

.error-msg {
  padding-top: 5px;
  display: inline-block;
  color: $color-danger;
  font-size: 1em;
}</style>
