
<template>
  <v-select
    v-model="selectedValue"
    :items="items"
    :label="label"
    :loading="loading"
    :item-title="itemTitle"
    :item-value="itemValue"
    variant="outlined"
    density="compact"
  ></v-select>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { gql } from 'graphql-tag';

const props = defineProps<{
  modelValue: any;
  dataSource?: string;
  label: string;
  options?: any[];
  itemTitle?: string;
  itemValue?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const loading = ref(false);
const items = ref<any[]>([]);
const selectedValue = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  selectedValue.value = newValue;
});

watch(selectedValue, (newValue) => {
  emit('update:modelValue', newValue);
});

async function fetchFromDataSource() {
  if (!props.dataSource) return;
  loading.value = true;
  try {
    const queryName = props.dataSource.charAt(0).toUpperCase() + props.dataSource.slice(1);
    const query = gql`query Get${queryName} { ${props.dataSource} { _id name } }`;

    const { data, error } = await useAsyncQuery(query);

    if (error.value) {
      throw error.value;
    }

    if (data.value && data.value[props.dataSource]) {
      items.value = data.value[props.dataSource].map((item: any) => ({
        label: item.name,
        value: item._id,
      }));
    }
  } catch (error) {
    console.error(`Error fetching data for ${props.dataSource}:`, error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (props.dataSource) {
    fetchFromDataSource();
  } else if (props.options) {
    items.value = props.options;
  }
});
</script>
