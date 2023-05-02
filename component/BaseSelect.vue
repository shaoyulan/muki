<template>
  <Dropdown
    :modelValue="inputValue"
    :options="options"
    :filter="true"
    placeholder="請選擇"
    emptyMessage="無"
    emptyFilterMessage="無"
    appendTo="self"
    :name="name"
    @change="handleSelect"
  >
    <template #value="slotProps">
      <div class="country-item country-item-value" v-if="slotProps.value">
        <div>{{ slotProps.value }}</div>
      </div>
      <span v-else>
        {{ slotProps.placeholder }}
      </span>
    </template>
    <template #option="slotProps">
      <div class="country-item">
        <div>{{ slotProps.option.name }}</div>
      </div>
    </template>
  </Dropdown>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useField } from "vee-validate";
import Dropdown from "primevue/dropdown/sfc";

export default {
  emits: ["update:modelValue", "selectChange1", "selectChange2"],
  props: {
    name: {
      type: String,
      default: "",
    },
    inputValue: {
      type: String,
      default: "",
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  components: { Dropdown },
  setup(props, context) {
    const { emit } = context;
    const { value, name } = props;
    const { state, commit } = useStore();

    const {
      value: inputValue,
      errorMessage,
      handleChange,
      meta,
    } = useField(name, undefined, {
      initialValue: value,
    });
    const handleSelect = (info) => {
      const val = info.value.name;
      handleChange(val);
      emit("update:modelValue", val);
      emit("selectChange1", val);
      emit("selectChange2", inputValue.value);
    };

    return {
      errorMessage,
      inputValue,
      handleSelect,
      meta,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>