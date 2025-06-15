<template>
  <div>
    <input type="checkbox" v-model="isSelectAll" @change="onChange" id="checkobx">
    <label for="checkobx">
      <span class="txt">全選</span>
    </label>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue';

export default {
  emits: ['update:modelValue', 'switchChange'],
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const isSelectAll = ref(0);

    const onChange = () => {
        emit("update:modelValue", isSelectAll.value);
        emit("switchChange", isSelectAll.value);
    };

    return { isSelectAll, onChange };
  },
};
</script>

<style scoped lang="scss">
@import '~@/css/mixins';
@import '~@/css/grid';
@import '~@/css/variables';
#checkobx{
  display:none;
  & + label{
    position: relative;
    display:flex;
    width: 140px;
    height: 55px;
    padding:5px;
    border-radius: 31px;
    background: #fff;
    border: 2px solid #13BFD647;
    box-shadow: 0px 30px 22px #46485D29;
    vertical-align: middle;
    justify-content: space-between;
    transition: .5s;
    margin-top: 20px;
    margin-bottom: 27px;
    cursor: pointer;
    @include phone {
      margin-top: 15px;
      margin-bottom: 20px;
    }
    &:after{
      content: '';
      display:block;
      width: 50%;
      background:#13BFD6;
      border-radius: 31px;
      transition: .5s;
    }

    .txt{
      position: absolute;
      right:0;
      top: 50%;
      transform: translate(0, -50%);
      width: 50%;
      text-align:center;
      z-index: 2;
      font: normal normal bold 20px/18px Microsoft JhengHei;
      letter-spacing: 0px;
      color: #13BFD6;
    }
  }
  &:checked + label{
    background:#E7E8EB;
    border: 2px solid #fff;
    &:after{
      content: '';
      display:block;
      width: 50%;
      background:#F58C29;
      border-radius: 50px;
      transform: translateX(100%);
    }
    .txt{
      color:#fff;
    }

  }
}
</style>
