
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
import { useAuthStore } from '~/stores/authStore';

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
const authStore = useAuthStore();

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
    const response = await fetch(props.dataSource, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    items.value = data;
  } catch (error) {
    console.error('Error fetching from data source:', error);
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
