<template>
  <label
    class="bar-custom-control"
    :class="{
      'bar-custom-control_checked': isSelected,
      'bar-custom-control_checkbox': checkbox,
      'bar-custom-control_radio': radio,
    }"
  >
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
    <div class="bar-custom-control__head">
      <div class="bar-custom-control__icon">
        <i
          v-if="checkbox"
          class="icon-success-check"
        />
      </div>
      <div
        class="bar-custom-control__text"
        v-html="text"
      />
    </div>
    <div class="bar-custom-control__content">
      <slot />
    </div>
  </label>
</template>

<script setup>
import { useField } from "vee-validate"
import { Radio, Checkbox } from '@/js/functions.js'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  // 種類
  checkbox: Boolean,
  radio: Boolean,

  // radio checkbox 相關
  modelValue: [Boolean, String, Number, Array],
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

const Component = props.checkbox ? Checkbox : Radio

const {
  modelValue: thismodelValue,
  value: thisValue,
  name: thisName,
  required: thisRequired,
  disabled: thisDisabled,
  isSelected,
  toggleCheck
} = Component(reactive({
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

.bar-custom-control {
  --border-color: #{rgba($color-theme, 0.3)};
  background: #fff;
  border: 1px dotted var(--border-color);
  padding: 8px 10px;
  font-size: torem(18px);
  border-radius: 5px;
  color: rgba($color-theme, 0.5);
  display: block;
  cursor: pointer;

  .base-content-toggle {
    padding-top: 5px;
  }

  .u-checkbox {
    --u-checkbox-inactive-bg: #fff;
  }

  >input {
    display: none;
  }

  &__head {
    display: flex;
  }

  &__icon {
    margin-right: 11px;
    border: 1px solid var(--border-color);
    flex-shrink: 0;
    position: relative;

    i {
      opacity: 0;
      font-size: 12px;
      display: inline-block;
      transform: translateX(-50%) translateY(-50%) scale(calc(7 / 12));
      position: absolute;
      top: 50%;
      left: 50%;
    }
  }

  &__text {
    flex-grow: 1;
    min-width: 0;
  }

  &_checkbox {
    .bar-custom-control__icon {
      width: 16px;
      height: 16px;
      margin-top: 0.25em;
      border-radius: 4px;
    }
  }

  &_radio {
    .bar-custom-control__icon {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      margin-top: 0.2em;
    }
  }

  &_checked {
    --border-color: #fff;
    background: var(--brand-theme-color);
    color: #fff;
    border-style: solid;

    &.bar-custom-control_checkbox {

      .bar-custom-control__icon {
        i {
          opacity: 1;
        }
      }
    }

    &.bar-custom-control_radio {
      .bar-custom-control__icon {
        background: #fff;

        &:after {
          content: '';
          display: block;
          @include absolute(2px, 2px, 2px, 2px);
          border: 2px solid var(--brand-theme-color);
          border-radius: 50%;
        }
      }
    }
  }
}
</style>


