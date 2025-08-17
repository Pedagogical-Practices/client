<template>
  <v-select
    v-model="selectedValue"
    :items="options"
    :loading="loading"
    :label="field.label"
    :multiple="field.multiple"
    item-title="title"
    item-value="value"
    variant="outlined"
    @focus="loadOptionsIfNeeded"
  ></v-select>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useDataSourceStore } from '~/stores/dataSourceStore';
import type { FormField, DataSourceType } from '~/types';

const props = defineProps<{
  modelValue: any;
  field: FormField;
}>();

const emit = defineEmits(['update:modelValue']);

const dataSourceStore = useDataSourceStore();
const options = ref<Array<{ title: string; value: string }>>([]);
const loading = ref(false);
const selectedValue = ref(props.modelValue);
const hasLoadedAllOptions = ref(false);

// Function to load the full list of options for the dropdown
const loadOptionsIfNeeded = async () => {
  if (!props.field.dataSource || hasLoadedAllOptions.value) return;
  loading.value = true;
  try {
    const fetchedOptions = await dataSourceStore.fetchFormattedOptions(props.field.dataSource as DataSourceType);
    // Merge with existing options to avoid losing the pre-filled one
    const existingValues = new Set(options.value.map(o => o.value));
    fetchedOptions.forEach(opt => {
      if (!existingValues.has(opt.value)) {
        options.value.push(opt);
      }
    });
    hasLoadedAllOptions.value = true;
  } catch (error) {
    console.error(`Failed to load options for ${props.field.dataSource}:`, error);
  } finally {
    loading.value = false;
  }
};

// Function to fetch a single option by ID, used for pre-filling the select
const fetchAndSetInitialOption = async (id: string) => {
  if (id && typeof id === 'string' && props.field.dataSource) {
    // Do not fetch if the option is already in the list
    if (options.value.some(o => o.value === id)) {
      selectedValue.value = id;
      return;
    }

    loading.value = true;
    const initialOption = await dataSourceStore.fetchOptionById(props.field.dataSource as DataSourceType, id);
    if (initialOption) {
      // Add the fetched option to the list if it's not already there
      if (!options.value.some(o => o.value === initialOption.value)) {
        options.value.push(initialOption);
      }
      selectedValue.value = initialOption.value;
    }
    loading.value = false;
  }
};

// On mount, if there is an initial ID, fetch just that single item to display it
onMounted(() => {
  fetchAndSetInitialOption(props.modelValue);
});

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    fetchAndSetInitialOption(newValue);
  }
});

// Watch for internal changes to selectedValue to emit updates
watch(selectedValue, (newValue) => {
  emit('update:modelValue', newValue);
});

</script>