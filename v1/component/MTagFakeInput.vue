<template>
  <FormItem class="m-tag-fake-input">
    <template
      v-if="label"
      #label
    >
      <div v-html="label" />
    </template>
    <UInput 
      readonly
      v-bind="{
        h,
        placeholder,
      }"
      @update:modelValue="$emit('update:modelValue', $event)"
    >
      <div 
        ref="refMultipleDisplay"
        class="m-tag-fake-input__multiple-display"
      >
        <MJTags
          v-slot="slotProp"
          :star="star"
          gap="10px"
          :gap-affect-outside="false"
          :list="modelValue"
          :close-btn="closeBtn"
          @star-click="$emit('starClick', $event)"
          @close-click="$emit('closeClick', $event);"
        >
          #{{ slotProp.item.name }}
          <div
            v-if="slotProp.item.count > 1"
            class="m-tag-fake-input__multiple-item-count"
          >
            x{{ slotProp.item.count }}
          </div>
        </MJTags>
        <!-- <div 
          v-for="(item, idx) in modelValue" 
          :key="idx" 
          class="m-tag-fake-input__multiple-item"
          @click="$emit('itemClick', item)"
        >
          <div
            class="fake-input-star"
            :class="{'active': item.stared }"
            @click.stop="$emit('starClick', item)"
          >
            <i
              v-if="star"
              class="icon-star-icon"
            />
          </div>
          <slot :item="item">
            # {{ item.name }}
            <div
              v-if="item.count > 1"
              class="m-tag-fake-input__multiple-item-count"
            >
              x{{ item.count }}
            </div>
          </slot>
        </div> -->
        <div
          v-if="placeholder && noData"
          class="m-tag-fake-input__placeholder"
        >
          {{ placeholder }}
        </div>
      </div>
    </UInput>
  </FormItem>
</template>

<script setup>
import { useField, ErrorMessage } from 'vee-validate';
import { bindDragScroll } from '@/js/functions'

  const emit = defineEmits(['starClick', 'itemClick', 'closeClick'])

  const props = defineProps({
    // 顯示星星
    star: {
      type: Boolean,
      default: false,
    },
    closeBtn:{
      type: Boolean,
      default: false,
    },
    /**
     * @property {array} modelValue
     * @property {string} modelValue[].name
     * @property {number} modelValue[].count
     * @property {boolean} modelValue[].stared
     */
    modelValue: {
      type: Array,
      default() {
        return [];
      },
    },
    inputBind: {
      type: Object,
      default() {
        return {};
      },
    },
    h:{
      type: String,
      default: '35px',
    },
    // FormItem
    label:{
      type: String,
      default: '',
    },
    // 原生
    placeholder: {
      type: String,
      default: '',
    },
  })

  const refMultipleDisplay = ref(null)

  const noData = computed(()=>{
    if ( !props.modelValue ) return true;
    if ( !Array.isArray(props.modelValue) ) return true;

    if ( !props.modelValue.length ) {
      return true;
    }
  })

  onMounted(()=>{
    if ( refMultipleDisplay.value ) {
      bindDragScroll(refMultipleDisplay.value)
    }
  });

</script>

<style lang="scss">
@import '@design';

.m-tag-fake-input{
  --base-input-radius: 5px;
  --base-input-font-size: 1rem;
  --base-input-label-font-size: #{torem(16px)};
  cursor: default;

  .mj-tags__item{
    font-size: torem(18px);
  }

  &__multiple-display{
    display: flex;
    overflow-x: auto;
    padding: 8px;
    &::-webkit-scrollbar {
      width: 0;  /* Remove scrollbar space */
      height: 0;
      background: transparent;  /* Optional: just make scrollbar invisible */
    }
  }

  &__multiple-item{
    background: rgba(#114EF8, 0.1);
    color: #114EF8;
    font-size: torem(18px);
    padding: 0px 5px;
    border-radius: 5px;
    display: flex;
    white-space: nowrap;
    user-select: none;
    
    + .m-tag-fake-input__multiple-item{
      margin-left: 5px;
    }
  }

  &__multiple-item-count{
    color: #000000;
    margin-left: 5px;
  }

  &__placeholder{
    font-size: 18px;
    color: #7E828D;
  }

  .u-input{
    background: var(--base-input-bg);
    border-radius: var(--base-input-radius);
  }

  .fake-input-star{
    font-size: torem(15px);
    text-decoration: none;
    margin-right: 4px;
    cursor: pointer;
    color: #020F88;
    align-self: center;
    i {
      opacity: 0.2;
    }
    &.active i{
      color: #FFB300;
      opacity: 1;
    }
  }
}

</style>
