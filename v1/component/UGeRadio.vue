<template>
  <label
    class="u-ge-radio"
    :class="{
      'u-ge-radio_inline': inline,
      'u-ge-radio_checked': isChecked,
    }"
  >
    <div class="u-ge-radio__hidden">
      <slot />
    </div>
    <div
      class="u-ge-radio__main"
      @click="isChecked = !isChecked"
    >
      <div class="u-ge-radio__icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10.465"
          height="8.164"
          viewBox="0 0 10.465 8.164"
        >
          <path
            id="Path_69002"
            data-name="Path 69002"
            d="M7.948,13.011a1.25,1.25,0,0,1-.871-.354l-3.186-3.1A1.25,1.25,0,1,1,5.634,7.767L7.858,9.929l3.914-4.639A1.25,1.25,0,1,1,13.683,6.9L8.9,12.567a1.25,1.25,0,0,1-.894.442Z"
            transform="translate(-3.512 -4.847)"
            fill="#fff"
          />
        </svg>
      </div>
      <div class="u-ge-radio__text">
        <slot name="label">
          {{ text }}
        </slot>
      </div>
    </div>
    <div
      v-if="$slots['errorMsg']"
      class="u-ge-radio__error-msg"
    >
      <div class="error-msg">
        <slot name="errorMsg" />
      </div>
    </div>
  </label>
</template>

<script setup>
/**
 * 純UI Input
 */

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  inline: Boolean,
  modelValue: Boolean,
  text: String,
})

const isChecked = ref(props.modelValue)

watch(isChecked, () => {
  emit('update:modelValue', isChecked.value)
})

</script>

<style lang="scss">
@import '@design';

.u-ge-radio {
  --custom-control-active-bg: #020F88;
  --custom-control-inactive-bg: #ECECEC;
  --custom-control-active-text-color: #000;
  --custom-control-inactive--textcolor: #000;
  --custom-control-size: 20px;
  --custom-control-border-size: 0px;
  display: flex;
  font-family: $ff-msjh;
  cursor: pointer;
  color: var(--custom-control-inactive--textcolor);

  &__main {
    display: flex;
    align-items: center;
  }

  &__hidden {
    display: none;
  }

  &__icon {
    width: var(--custom-control-size);
    height: var(--custom-control-size);
    background: #fff;
    border-radius: 50%;
    position: relative;

    &:before {
      content: '';
      display: block;
      @include absolute(0, 0, 0, 0);
      border: var(--custom-control-border-size) solid var(--custom-control-active-bg);
      background: var(--custom-control-active-bg);
      border-radius: inherit;
      opacity: 0;
    }

    &:after {
      content: '';
      display: block;
      @include absolute(0, 0, 0, 0);
      background: var(--custom-control-inactive-bg);
      border-radius: inherit;
    }

    svg {
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 1;
      transform: translateX(-50%) translateY(-50%);
      opacity: 0;
    }
  }

  &__text {
    padding-left: 0.3em;
  }

  &_inline {
    display: inline-flex;
    margin-right: var(--custom-control-size);
    margin-bottom: 10px;
  }

  &_checked {
    color: var(--custom-control-active-text-color);

    .u-ge-radio__icon {
      &:before {
        opacity: 1;
      }

      &:after {
        opacity: 0;
      }

      background: #fff;

      svg {
        opacity: 1;
      }
    }
  }
}
</style>
