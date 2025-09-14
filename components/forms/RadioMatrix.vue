<template>
  <div class="radio-matrix-container pa-2 border rounded">
    <v-label class="mb-2">{{ label }}</v-label>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left font-weight-bold">{{ itemsLabel }}</th>
          <th v-for="col in columns" :key="col.value" class="text-center font-weight-bold">
            {{ col.text }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item">
          <td class="text-left">{{ item }}</td>
          <td v-for="col in columns" :key="col.value" class="radio-cell">
            <v-radio-group v-model="matrixValue[item].value" inline>
              <v-radio :value="col.value"></v-radio>
            </v-radio-group>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label?: string;
  modelValue: Record<string, any> | string | null;
  options: {
    items: { label: string; values: string[] } | string[];
    columns: { text: string; value: any }[];
  };
}>();

const emit = defineEmits(['update:modelValue']);

const itemsLabel = computed(() => {
  if (props.options?.items && typeof props.options.items === 'object' && !Array.isArray(props.options.items)) {
    return props.options.items.label;
  }
  return ''; // No label if items is a simple array
});

const items = computed(() => {
  if (props.options?.items) {
    if (Array.isArray(props.options.items)) {
      return props.options.items; // Handle old format
    }
    return props.options.items.values || []; // Handle new format
  }
  return [];
});

const columns = computed(() => props.options?.columns || []);

// Computed property for each row's radio group
const matrixValue = computed(() => {
  const handler = {
    get: (target: any, key: string) => ({
      value: typeof props.modelValue === 'object' && props.modelValue?.[key],
    }),
    set: (target: any, key: string, value: any) => {
      const currentModel = typeof props.modelValue === 'object' && props.modelValue !== null ? props.modelValue : {};
      const newValue = {
        ...currentModel,
        [key]: value.value,
      };
      emit('update:modelValue', newValue);
      return true;
    },
  };
  return new Proxy({}, handler);
});

</script>

<style scoped>
.radio-matrix-container {
  width: 100%;
}
.radio-cell {
  text-align: right;
}
.v-radio-group {
  justify-content: flex-end;
  width: 100%;
}
.v-radio {
  justify-content: center;
}
</style>