<template>
  <label
    class="u-checkbox"
    :class="{
      'u-checkbox_inline': inline,
      'u-checkbox_checked': checked,
    }"
  >
    <div class="u-checkbox__hidden">
      <slot />
    </div>
    <div class="u-checkbox__main">
      <div class="u-checkbox__icon">
        <i class="icon-success-check" />
      </div>
      <div class="u-checkbox__text">
        <slot name="label">
          {{ text }}
        </slot>
      </div>
    </div>
    <div
      v-if="$slots['errorMsg']"
      class="u-chekcbox__error-msg"
    >
      <div class="error-msg">
        <slot name="errorMsg" />
      </div>
    </div>
  </label>
</template>

<script setup>
/**
 * 純UI checkbox
 */

const props = defineProps({
  inline: Boolean,
  checked: Boolean,
  text: String,
})

</script>

<style lang="scss">
@import '@design';

.u-checkbox {
  --u-checkbox-text-padding-left: 4px;
  --u-checkbox-size: 20px;
  --u-checkbox-border-size: 5px;
  --u-checkbox-inactive-bg: #C8C7CC;
  --u-checkbox-active-bg: #333333;
  font-family: $ff-msjh;

  &__main {
    display: flex;
    align-items: center;
  }

  &[readonly] {
    cursor: default;
  }

  &:hover:not(.u-checkbox_checked):not([readonly]) {
    .u-checkbox__icon {
      background: var(--u-checkbox-inactive-bg);
    }
  }

  &__hidden {
    display: none;
  }

  &__icon {
    width: var(--u-checkbox-size);
    height: var(--u-checkbox-size);
    @include flex(center, center);
    background: var(--u-checkbox-inactive-bg);
    border-radius: 5px;
    position: relative;
    overflow: hidden;

    i {
      color: #fff;
      display: inline-block;
      font-size: 12px;
      font-weight: normal;
      transform: scale(calc(8 / 12));
      opacity: 0;
    }

    &:before {
      content: '';
      display: block;
      @include absolute(0, 0, 0, 0);
      border: 2px solid var(--u-checkbox-inactive-bg);
    }
  }

  &__text {
    padding-left: var(--u-checkbox-text-padding-left);
  }

  &_inline {
    display: inline-flex;
    margin-right: var(--u-checkbox-size);
    margin-bottom: 15px;
  }

  &_checked {
    .u-checkbox__icon {
      background: var(--u-checkbox-active-bg);
      color: #fff;

      &:before {
        border-color: var(--u-checkbox-active-bg);
      }

      i {
        opacity: 1;
      }
    }
  }
}
</style>
