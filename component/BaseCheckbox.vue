<template>
  <UCheckbox
    class="base-checkbox"
    :checked="isSelected"
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
  </UCheckbox>
</template>

<script setup>
import { useField } from "vee-validate";
import { Checkbox } from '@/js/functions.js'

  const props = defineProps({
    modelValue: {
        type: [String, Number, Array, Boolean],
        default: '',
    },
    value: {
        type: [String, Number, Boolean],
        default: ''
    },
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

  const emit = defineEmits(['update:modelValue']);

  const {
      modelValue: thismodelValue,
      value: thisValue,
      name: thisName,
      required: thisRequired,
      disabled: thisDisabled,
      isSelected,
      toggleCheck
  } = Checkbox(reactive({
      emit: emit,
      modelValue: computed(()=> props.modelValue),
      value: computed(()=> props.value),
      name: computed(()=> props.name),
      required: computed(()=> props.required),
      disabled: computed(()=> props.disabled),
  }));

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
  } = useField(props.name);

</script>

<style lang="scss">
@import '@design';

.base-checkbox{
    --custom-control-size: 20px;
    --custom-control-inactive-color: #E9EDF9;
    --custom-control-active-color: #005295;
    cursor: pointer;

    &:not(.u-checkbox_inline){
        display: block;
    }

    &_has-content{
        .custom-control__icon-wrap{
            margin-right: 10px;
        }
    }

    &.is-checked .custom-control__icon-wrap{
        --custom-control-inactive-color: var(--custom-control-active-color);
        background: var(--custom-control-active-color);
        .custom-control__icon{
            visibility: visible;
        }
    }

    .custom-control-inner{
        display: flex;
    }

    .custom-control__input{
        display: none;
    }

    .custom-control__icon{
        font-size: 12px;
        transform: scale(calc(10 / 12));
        transform-origin: center;
        visibility: hidden;
        color: #fff;
    }

    .custom-control__icon-wrap{
        flex-shrink: 0;
        width: var(--custom-control-size);
        height: var(--custom-control-size);
        @include flex(center,center);
        border: 1px solid var(--custom-control-inactive-color);
        border-radius: 3px;
    }

    .custom-control__hint{
        color: $color-danger;
    }

}


</style>


