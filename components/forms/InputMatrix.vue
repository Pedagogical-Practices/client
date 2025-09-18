<template>
  <v-container class="pa-0">
    <v-label class="mb-2">{{ label }}</v-label>
    <v-table density="compact">
      <thead>
        <tr>
          <!-- Static headers for item values -->
          <th
            v-for="(header, index) in itemHeaders"
            :key="`item-header-${index}`"
            class="text-left font-weight-bold"
          >
            {{ header }}
          </th>
          <!-- Dynamic headers for input columns -->
          <th
            v-for="(col, index) in columns"
            :key="`col-header-${index}`"
            class="text-left font-weight-bold"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Iterate over each item object -->
        <tr v-for="item in items" :key="item.key">
          <!-- Render static item values -->
          <td
            v-for="(value, index) in item.values"
            :key="`item-val-${index}`"
            class="pr-4"
          >
            {{ value }}
          </td>
          <!-- Render dynamic input columns -->
          <td v-for="(col, index) in columns" :key="`col-input-${index}`">
            <v-textarea
              v-if="col.input === 'TEXTAREA'"
              v-model="cellValue(item.key, col.label).value"
              rows="2"
              auto-grow
              density="compact"
              class="my-2"
              variant="outlined"
            ></v-textarea>
            <v-radio-group
              v-else-if="Array.isArray(col.options)"
              v-model="cellValue(item.key, col.label).value"
              inline
            >
              <v-radio
                v-for="opt in col.options"
                :key="opt.value"
                :label="opt.text"
                :value="opt.value"
              ></v-radio>
            </v-radio-group>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";

// Define the new, more structured props
const props = defineProps<{
  label?: string;
  modelValue: Record<string, any> | string | null;
  options: {
    itemHeaders?: string[];
    items?: Array<{ key: string; values: string[] }>;
    columns?: any[];
  };
}>();

const emit = defineEmits(["update:modelValue"]);

// Computed properties to safely access the new structure
const itemHeaders = computed(() => props.options?.itemHeaders || []);
const items = computed(() => props.options?.items || []);
const columns = computed(() => props.options?.columns || []);

// The core logic for cell value handling remains the same,
// it's robust enough to handle the new key-based structure.
const cellValue = (itemKey: string, colKey: string) => {
  return computed({
    get() {
      if (typeof props.modelValue === "object" && props.modelValue !== null) {
        // Access the nested value using the row's unique key and the column's label
        return props.modelValue[itemKey]?.[colKey] || null;
      }
      return null;
    },
    set(value) {
      const currentModel =
        typeof props.modelValue === "object" && props.modelValue !== null
          ? { ...props.modelValue }
          : {};

      const updatedRow = { ...(currentModel[itemKey] || {}), [colKey]: value };
      const newValue = { ...currentModel, [itemKey]: updatedRow };

      emit("update:modelValue", newValue);
    },
  });
};
</script>

<style scoped>
.v-radio-group--inline .v-radio {
  margin-right: 16px;
}
.v-table td,
.v-table th {
  padding: 4px 8px !important;
  vertical-align: top;
}
</style>
