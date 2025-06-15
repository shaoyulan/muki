<template>
  <div
    ref="refRoot"
    class="form-item"
    :class="[
      {
        'form-item_horizontal': horizontal
      },
      variant ? `form-item_${variant}` : null
    ]"
    :style="{
      '--form-item-label-pdt': `${cData.labelPdt}px`,
      '--form-item-label-width': labelWidth || null,
    }"
  >
    <div
      v-if="$slots['label'] || label"
      ref="refItemLabel"
      class="form-item__label"
    >
      <div class="form-item__label-content">
        <slot name="label">
          {{ label }}
        </slot>
        <span
          v-if="required"
          class="form-item__required"
        >*</span>
      </div>
    </div>
    <div class="form-item__main">
      <div
        ref="refItemContent"
        class="form-item__content"
      >
        <slot />
      </div>
      <div
        v-if="$slots['msg']"
        class="form-item__msg"
      >
        <slot name="msg" />
      </div>
      <div
        v-if="$slots['err-msg']"
        class="form-item__err-msg"
      >
        <slot name="err-msg" />
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  horizontal: Boolean,
  horizontalLabelMaxPdt: Number,
  label: String,
  labelWidth: String,
  // 樣式
  variant: String,
  required: Boolean
})

const cData = reactive({
  labelPdt: 0
})
const refRoot = ref(null)
const refItemLabel = ref(null)
const refItemContent = ref(null)

function checkLabelPdt() {
  if (!refItemLabel.value) return

  var labelComputedStyle = getComputedStyle(refItemLabel.value)
  var Label1remH = parseFloat(labelComputedStyle.lineHeight) || 0
  var contentH = refItemContent.value.clientHeight
  var pdt = (contentH / 2) - (Label1remH / 2)

  if (props.horizontalLabelMaxPdt) {
    if (pdt >= props.horizontalLabelMaxPdt) {
      cData.labelPdt = props.horizontalLabelMaxPdt
    }
  } else {
    cData.labelPdt = pdt
  }
}

function update() {
  checkLabelPdt()
}

onMounted(() => {

  checkLabelPdt()

  // 監聽更新要求
  refRoot.value.addEventListener('toUpdate', () => {
    update()
  })
})

defineExpose({
  // 提供外部元件來更新顯示
  update
})

</script>

<style lang="scss">
@import '@design';

// 專案
.form-item {

  &_theme {
    .form-item__label {
      color: #005295;
      font-weight: bold;
      letter-spacing: 0.8px;
    }
  }

}

// 專案 /

.form-item {
  --form-item-label-width: auto;

  &_horizontal {
    display: flex;

    .form-item__label {
      width: var(--form-item-label-width);
      padding-top: var(--form-item-label-pdt);
      padding-right: 5px;
      flex-shrink: 0;
    }
  }

  &__label {
    flex-shrink: 0;
    margin-bottom: 5px;
    font-size: var(--base-input-label-font-size);
    color: var(--base-input-label-color);
  }

  &__label-content {
    display: inline-block;
    position: relative;
  }

  &__required {
    color: #FC8B8B;
    font-size: 2em;
    line-height: 1;
    position: absolute;
    left: 100%;
    top: 0.04em;
  }

  &__main {
    flex-grow: 1;
    min-width: 0;
  }

  &__msg {
    font-size: 14px;
  }

  &__err-msg {
    font-size: 14px;
    color: var(--brand-theme-color);
  }
}
</style>