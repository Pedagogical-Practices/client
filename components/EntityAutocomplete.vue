<template>
  <v-autocomplete
    v-model="selectedItem"
    :items="items"
    :loading="loading"
    :label="label"
    item-title="title"
    item-value="value"
    hide-no-data
    hide-details
    :multiple="multiple"
    :chips="multiple"
    :clearable="true"
    return-object
    @update:model-value="onItemSelected"
    class="mb-4"
    variant="outlined"
  ></v-autocomplete>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useDataSourceStore } from '~/stores/dataSourceStore';
import { DataSourceType } from '~/types';

const props = defineProps({
  specificType: {
    type: String,
    required: false,
  },
  dataSource: {
    type: String as () => DataSourceType,
    required: false,
  },
  label: {
    type: String,
    default: "Seleccionar",
  },
  modelValue: {
    type: [String, Object, Array],
    default: null,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const dataSourceStore = useDataSourceStore();
const items = ref<any[]>([]);
const loading = ref(false);
const selectedItem = ref<any>(props.modelValue);

const loadOptions = async () => {
  const source = props.dataSource || props.specificType;
  if (!source) {
    items.value = [];
    return;
  }

  loading.value = true;
  try {
    items.value = await dataSourceStore.fetchFormattedOptions(source as DataSourceType);
  } catch (error) {
    console.error(`Failed to load options for ${source}:`, error);
    items.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(loadOptions);
watch(() => props.dataSource || props.specificType, loadOptions);

watch(() => props.modelValue, (newValue) => {
  selectedItem.value = newValue;
}, { immediate: true, deep: true });

const onItemSelected = (value: any) => {
  if (props.multiple) {
    const emittedValue = Array.isArray(value) ? value.map((item: any) => item.value) : [];
    emit("update:modelValue", emittedValue);
  } else {
    const emittedValue = value ? value.value : null;
    emit("update:modelValue", emittedValue);
  }
};
</script>
