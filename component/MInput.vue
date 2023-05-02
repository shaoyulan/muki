<template>
  <FormItem 
    class="m-input"
    :class="[
      icon ? 'm-input_append-icon':'',
      variant ? `m-input_${variant}` : '',
      tag == 'textarea' ? 'm-input_textarea':'',
    ]"
  >
    <div
      ref="refAccess"
      style="position:absolute;"
    />
    <template
      v-if="label"
      #label
    >
      <div v-html="label" />
    </template>
    <UInput 
      :model-value="modelValue"
      v-bind="{
        h,
        bg,
        fz,
        name,
        radius,
        placeholder,
        readonly,
        disabled,
        type,
        tag,
        inputBind,
      }"
      @update:modelValue="$emit('update:modelValue', $event)"
    >
      <template
        v-if="$slots['append'] || icon || password"
        #append
      >
        <i
          class="icon"
          :class="icon"
        />
        <i
          v-if="password"
          class="icon-pwd-to-see"
          @click="togglePassword"
        />
        <i
          v-if="password"
          class="icon-pwd-to-hide"
          @click="togglePassword"
        />
      </template>
    </UInput>
    <template
      v-if="errorMessage"
      #err-msg
    >
      {{ errorMessage }}
    </template>
  </FormItem>
</template>

<script setup>
/**
 * 
 */
import { useField, ErrorMessage } from 'vee-validate';

  const props = defineProps({
    modelValue: null,
    inputBind: Object,
    password: Boolean,
    h:String,
    fz: String,
    radius: String,
    variant: String,
    tag:String,
    // FormItem
    label:String,
    icon: String,
    // other
    bg:String,
    // 原生
    placeholder: String,
    name: String,
    readonly: Boolean,
    disabled: Boolean,
    type: {
      type: String,
      default: 'text'
    },
  })

  var errorMessage = ''; // prevent vue from showing false alert

  const refAccess = ref(null);
  var refRoot = ''

  const cData = reactive({
    passwordVisible: false,
  })

  function toHidePwd(){
    cData.passwordVisible = false;
    refRoot.find('input').attr('type', 'password')
    refRoot.find('.icon-pwd-to-see').show();
    refRoot.find('.icon-pwd-to-hide').hide();
  }

  function toShowPwd(){
    cData.passwordVisible = true;
    refRoot.find('input').attr('type', 'text')
    refRoot.find('.icon-pwd-to-see').hide();
    refRoot.find('.icon-pwd-to-hide').show();
  }

  function togglePassword(){
    if ( cData.passwordVisible ) {
      toHidePwd()
    } else{
      toShowPwd()
    }
  }

  function update(evt){
    console.log('evt', evt)
  }

  onMounted(()=>{

    const refAccessEl = $(refAccess.value);
    refRoot = refAccessEl.closest('.m-input')

    if ( props.password ) {
      toHidePwd()
    }
  })


  if ( props.name ) {
    // validate
    var {
        errorMessage,
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
    } = useField(props.name);
  }


  defineExpose({ refRoot })

</script>

<style lang="scss">
@import '@design';

.m-input{
  --base-input-radius: 5px;
  --base-input-font-size: 1rem;

  &:focus-within{
    --base-input-bg: #FFFFFF;
    --base-input-icon-color: #E85252;
    .u-input{
      position: relative;
      &:after{
        content:'';
        display: block;
        @include absolute(0,0,0,0);
        border-radius: var(--base-input-radius);
        pointer-events: none;
        border: 2px solid #E85252;
      }
    }
  }

  .icon-pwd-to-see, .icon-pwd-to-hide{
    font-size: 26px;
    color: #7e828d;
    cursor: pointer;
  }

  &_textarea{
    --base-input-height: auto;
  }

  &_append-icon{
    input, textarea{
        padding-right: 35px;
    }
    .u-input__append{
      width: 40px;
      color: var(--base-input-icon-color);
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        font-size: var(--base-input-icon-size);
      }
    }
  }

  @mixin m-input_bar{
    --base-input-bg: #fff;
    --base-input-font-size: #{torem(18px)};
    --base-input-radius: 9px;
    --base-input-hpadding: 14px;
    --base-input-vpadding: 12px;
    background: var(--base-input-bg);
    border-radius: var(--base-input-radius);
    padding: var(--base-input-vpadding) var(--base-input-hpadding);
    font-size: var(--base-input-font-size);

    .form-item__label{
      padding-right: 10px;
    }
    .form-item__main{
      input, textarea{
        padding-left: 10px;
      }
    }
    .u-input{
      position: relative;
      &:before{
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        background: #D6D6D6;
        height: 20px;
        z-index: 2;
      }
      &:after{
        display: none!important;
      }
    }
  }

  &_bar{
    @include m-input_bar;
  }

  &_bar-normal{
    @include m-input_bar;
    --base-input-vpadding: 0;
  }
}

</style>
