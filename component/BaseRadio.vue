<template>
  <URadio :checked="isSelected">
    <input
      type="checkbox"
      v-bind="{
        name: thisName,
        disabled: thisDisabled,
        required: thisRequired,
        'true-value': true,
        'false-value': false
      }"
      @change="toggleCheck()"
    >
    <template #label>
      <slot>
        {{ text }}
      </slot>
    </template>
    <template
      v-if="thisErrMsg"
      #errorMsg
    >
      {{ thisErrMsg }}
    </template>
  </URadio>
</template>

<script setup>
import { computed, ref, onMounted, reactive } from "vue"
import { useField } from "vee-validate"
import { Radio } from '@/js/functions.js'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: [String, Number, Array],
  value: [String, Number, Boolean],
  text: [String],
  name: {
    type: [String, Number],
    default: '',
  },
  required: Boolean,
  disabled: Boolean,

  // size
  size: String
  // size /
})

const {
  modelValue: thismodelValue,
  value: thisValue,
  name: thisName,
  required: thisRequired,
  disabled: thisDisabled,
  isSelected,
  toggleCheck
} = Radio(reactive({
  emit: emit,
  modelValue: computed(() => props.modelValue),
  value: computed(() => props.value),
  name: computed(() => props.name),
  required: computed(() => props.required),
  disabled: computed(() => props.disabled),
}))

// validate
const {
  errorMessage: thisErrMsg,
  name,
  value,
  meta,
  errors,
  resetField,
  validate,
  handleChange,
  handleBlur,
  setValidationState,
  checked,
} = useField(props.name)

</script>

<style lang="scss">
@import '@design';

.base-radio {
  --custom-control-size: 20px;
  --custom-control-border-width: 1px;
  --custom-control-inactive-color: #E9EDF9;
  --custom-control-active-color: #005295;
  display: block;
  cursor: pointer;

  &_has-content {
    .custom-control__icon-wrap {
      margin-right: 10px;
    }
  }

  &.is-checked .custom-control__icon-wrap {
    --custom-control-inactive-color: var(--custom-control-active-color);
    background: var(--custom-control-active-color);

    .custom-control__icon {
      visibility: visible;
    }
  }

  .custom-control-inner {
    display: flex;
  }

  .custom-control__input {
    display: none;
  }

  .custom-control__icon_check,
  .custom-control__icon_radio {
    display: none;
  }

  &_sty_check {
    .custom-control__icon {
      font-size: 12px;
      transform: scale(calc(10 / 12));
      transform-origin: center;
      visibility: hidden;
      color: #fff;
    }

    .custom-control__icon-wrap {
      flex-shrink: 0;
      width: var(--custom-control-size);
      height: var(--custom-control-size);
      @include flex(center, center);
      border: var(--custom-control-border-width) solid var(--custom-control-inactive-color);
      border-radius: 3px;
    }

    .custom-control__icon_check {
      display: block;
    }
  }

  &_sty_radio {

    .custom-control__icon {
      font-size: 12px;
      transform: scale(calc(10 / 12));
      transform-origin: center;
      visibility: hidden;
      color: #fff;
    }

    .custom-control__icon-wrap {
      flex-shrink: 0;
      width: var(--custom-control-size);
      height: var(--custom-control-size);
      border-radius: 50%;
      @include flex(center, center);
      border: var(--custom-control-border-width) solid var(--custom-control-inactive-color);
      border-radius: 3px;
      border-radius: 50%;
    }

    .custom-control__icon_radio {
      display: block;
      width: 40%;
      height: 40%;
      background: #fff;
      border-radius: 50%;
      transform: none;
    }
  }

}
</style>


