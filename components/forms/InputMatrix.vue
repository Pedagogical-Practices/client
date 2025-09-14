<template>
  <v-container class="pa-0">
    <v-label class="mb-2">{{ label }}</v-label>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left font-weight-bold">{{ itemsLabel }}</th>
          <th
            v-for="(col, index) in columns"
            :key="index"
            class="text-left font-weight-bold"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="itemValue in items" :key="itemValue">
          <td class="pr-4">{{ itemValue }}</td>
          <td v-for="(col, index) in columns" :key="index">
            <v-textarea
              v-if="col.input === 'TEXTAREA'"
              v-model="cellValue(itemValue, col.label).value"
              rows="2"
              auto-grow
              density="compact"
              class="my-2"
              variant="outlined"
            ></v-textarea>
            <v-radio-group
              v-else-if="Array.isArray(col.options)"
              v-model="cellValue(itemValue, col.label).value"
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

const props = defineProps<{
  label?: string;
  modelValue: Record<string, any> | string | null;
  options: {
    items: { label: string; values: string[] } | string[];
    columns: any[];
  };
}>();

const emit = defineEmits(["update:modelValue"]);

const itemsLabel = computed(() => {
  if (
    props.options?.items &&
    typeof props.options.items === "object" &&
    !Array.isArray(props.options.items)
  ) {
    return props.options.items.label;
  }
  return ""; // No label if items is a simple array
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

const cellValue = (itemKey: string, colKey: string) => {
  return computed({
    get() {
      if (typeof props.modelValue === "object" && props.modelValue !== null) {
        return props.modelValue[itemKey]?.[colKey] || null;
      }
      return null;
    },
    set(value) {
      const currentModel =
        typeof props.modelValue === "object" && props.modelValue !== null
          ? props.modelValue
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
