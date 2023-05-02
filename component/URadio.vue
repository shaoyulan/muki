<template>
  <label
    class="u-radio"
    :class="{
      'u-radio_inline': inline,
      'u-radio_checked': checked,
    }"
  >
    <div class="u-radio__hidden">
      <slot />
    </div>
    <div class="u-radio__main">
      <div class="u-radio__icon" />
      <div class="u-radio__text">
        <slot name="label">
          {{ text }}
        </slot>
      </div>
    </div>
    <div
      v-if="$slots['errorMsg']"
      class="u-radio__error-msg"
    >
      <div class="error-msg">
        <slot name="errorMsg" />
      </div>
    </div>
  </label>
</template>

<script>
/**
 * 純UI Radio
 */

const props = defineProps({
  inline: Boolean,
  checked: Boolean,
  text: String,
})

</script>

<style lang="scss">
@import '@design';

.u-radio {
  --u-radio-size: 20px;
  --u-radio-border-size: 6px;
  --u-checkbox-inactive-bg: #C8C7CC;
  --u-checkbox-active-bg: #333333;

  font-family: $ff-msjh;

  &__main {
    display: flex;
    align-items: center;
  }

  &__hidden {
    display: none;
  }

  &__icon {
    width: var(--u-radio-size);
    height: var(--u-radio-size);
    background: #fff;
    border-radius: 50%;
    position: relative;

    &:before {
      content: '';
      display: block;
      @include absolute(0, 0, 0, 0);
      border: var(--u-radio-border-size) solid var(--u-checkbox-active-bg);
      border-radius: inherit;
      opacity: 0;
    }

    &:after {
      content: '';
      display: block;
      @include absolute(0, 0, 0, 0);
      border: 2px solid #EEF5CC;
      border-radius: inherit;
    }
  }

  &__text {
    padding-left: 0.3em;
  }

  &_inline {
    display: inline-flex;
    margin-right: var(--u-radio-size);
    margin-bottom: 10px;
  }

  &_checked {
    .u-radio__icon {
      &:before {
        opacity: 1;
      }

      &:after {
        opacity: 0;
      }

      background: #fff;
    }
  }
}
</style>
