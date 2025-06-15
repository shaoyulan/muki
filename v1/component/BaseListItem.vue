<template>
  <li
    v-for="item in storeList.data"
    :key="item.id"
    :class="[{ 'join': item.is_join }]"
  >
    <label class="label">
      <div class="list-item">{{ item.store_name }}</div>
      <div class="list-item">{{ item.city_name }} {{ item.area_name }}</div>
      <div class="list-item">{{ item.content }}</div>
      <div class="list-item">
        <label v-if="item.is_join">
          <input
            type="checkbox"
            :value="item.id"
            v-model="selectedAry"
            @change="onChange"
          />
          <img src="@/assets/icon/checked.svg" alt="" />
          <div class="mask"></div>
        </label>
      </div>
    </label>
  </li>
</template>

<script>
import { ref, reactive, watch, computed } from 'vue';
import { useStore } from 'vuex';
import { basePost } from '@/js/services/baseService';

export default {
  emits: ['update:modelValue', 'switchChange'],
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    storeList: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const { state, commit } = useStore();

    // 全部店家 ID
    let allStoreId = reactive({ data: [] });

    // 活動資訊 ID
    const activityId = JSON.parse(localStorage.getItem('activityId'));

    // 取得活動資訊
    const getActivityList = async () => {
      try {
        const res = await basePost('/api_common/activity_detail', {
          activity_id: activityId,
        });
        const { status, data } = res;

        if (status === 200 && data.res_code === 1) {
          const { res_data } = data;
          // 取出全部可選取的店家 id
          allStoreId.data = res_data.store_data.map(item => item.is_join ? item.id : '');
        }
      } catch (err) {
        console.error(err);
      }
    };

    getActivityList();

    // switch 狀態
    const isSelectAll = computed(() => state.passInfoToNextPage.isSelectAll);
    let selectedAry = ref([]);

    // 全選
    watch(()=> isSelectAll.value, (list) => {
      if (list) {
        selectedAry.value = allStoreId.data;
         emit("chooseChange", selectedAry.value);
      } else {
        selectedAry.value = [];
      }
    })
    
    // 單擊
    const onChange = (e) => {
        emit("update:modelValue", selectedAry.value);
        emit("chooseChange", selectedAry.value);
    };


    return { selectedAry, onChange };
  },
};
</script>

<style scoped lang="scss">
@import '~@/css/mixins';
@import '~@/css/grid';
@import '~@/css/variables';
li {
  position: relative;
  &:hover {
    .label {
      background: #e7e8eb 0% 0% no-repeat padding-box;
      border-radius: 9px;
    }
  }
  @include pad_pro_lg {
    &:hover {
      .label {
        background: unset;
      }
    }
  }
  .label {
    display: flex;
    align-items: center;
    padding: 11px 0px 11px 55px;
    margin-bottom: 5px;
    font: normal normal bold 18px/29px Microsoft JhengHei;
    transition: all 0.3s;
    cursor: default;
    position: relative;
    &:after {
      position: absolute;
      content: '';
      border-bottom: 1px dashed #eee;
      bottom: 0;
      left: 0;
      right: 0;
    }
    @include pad_pro {
      display: block;
      width: 100%;
      padding: 11px;
    }
    .list-item {
      padding: 0 10px;
      word-break: break-all;
      @include pad_pro {
        width: 100% !important;
        text-align: center !important;
        padding: 0 !important;
        padding-bottom: 5px !important;
      }
      &:nth-child(1) {
        width: 30%;
        letter-spacing: 0.9px;
        color: #b3b9bf;
      }
      &:nth-child(2) {
        width: 30%;
        letter-spacing: 0px;
        color: #b3b9bf;
      }
      &:nth-child(3) {
        width: 30%;
        letter-spacing: 0.9px;
        color: #f58c29;
      }
      &:nth-child(4) {
        width: 10%;
      }
      .mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        content: '';
        background: #e7e8eb 0% 0% no-repeat padding-box;
        border-radius: 9px;
        z-index: -1;
        opacity: 0;
        transition: all 0.3s;
      }
    }
  }
}
.join {
  label {
    cursor: pointer;
  }
  .list-item {
    &:nth-child(1) {
      color: $color-blue !important;
    }
    &:nth-child(2) {
      color: #77797b !important;
    }
  }
}
.checked {
  .list-item {
    &:nth-child(1) {
      color: $color-blue !important;
    }
    &:nth-child(2) {
      color: #001123 !important;
    }
  }
}
input[type='checkbox'] {
  display: none;
}
input[type='checkbox'] + img {
  opacity: 0;
  transition: all 0.15s;
}

input[type='checkbox']:checked ~ img {
  opacity: 1;
}
input[type='checkbox']:checked ~ .mask {
  opacity: 1;
}
</style>
