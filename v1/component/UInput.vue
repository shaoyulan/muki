<template>
  <div
    class="u-input"
    :style="{
      '--base-input-height': h || null,
      '--base-input-radius': radius || null,
      '--base-input-bg': bg || null,
      '--base-input-font-size': fz || null,
    }"
  >
    <div
      v-if="$slots['prepend']"
      class="u-input__prepend"
    >
      <slot name="prepend" />
    </div>
    <slot>
      <component
        :is="tag"
        :value="cData.modelValue"
        autocomplete="off"
        v-bind="{
          type,
          name,
          placeholder,
          readonly,
          disabled,
          rows,
          ...inputBind
        }"
        @input="cData.modelValue = $event.target.value"
      />
    </slot>
    <div
      v-if="$slots['append']"
      class="u-input__append"
    >
      <slot name="append" />
    </div>
  </div>
</template>

<script setup>
/**
 * 純UI Input
 */

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: [String, Number],
  tag: {
    type: String,
    default: 'input'
  },
  inputBind: Object,
  h: String,
  fz: String,
  radius: String,
  bg: String,

  // 原生
  name: String,
  type: {
    type: String,
    default: 'text'
  },
  rows: Number,
  cols: Number,
  readonly: Boolean,
  disabled: Boolean,
  placeholder: String,
})

const cData = reactive({
  modelValue: props.modelValue
})


watch(() => props.modelValue, () => {
  cData.modelValue = props.modelValue
})

watch(() => cData.modelValue, () => {
  emit('update:modelValue', cData.modelValue)
})


</script>

<style lang="scss">
@import '@design';

.u-input {
  display: flex;
  min-height: var(--base-input-height);
  position: relative;
  font-size: var(--base-input-font-size);

  input,
  select,
  textarea {
    height: var(--base-input-height);
    font-size: var(--base-input-font-size);
    color: var(--base-input-color);
    background: var(--base-input-bg);
    outline: none;
    box-shadow: none;
    border: none;
    width: 100%;
    padding: var(--base-input-vpadding) var(--base-input-hpadding);
    caret-color: var(--base-input-caret-color);
    border-radius: var(--base-input-radius);

    &::placeholder {
      color: var(--base-input-placeholder-color);
    }

    &:focus,
    &:active {
      background: var(--base-input-bg);
      outline: none;
      box-shadow: none;
      border: none;
    }
  }

  &__prepend,
  &__append {
    flex-shrink: 0;
  }

  &__append {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

}
</style>
