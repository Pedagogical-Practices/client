<template>
  <div class="checkbox-matrix-container pa-2 border rounded">
    <v-card-text>{{ label }} </v-card-text>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left">Item</th>
          <th v-for="option in options" :key="option.value" class="text-center">
            {{ option.text }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item">
          <td>{{ item }}</td>
          <td v-for="option in options" :key="option.value" class="text-center">
            <v-checkbox
              v-model="localValue[item][option.value]"
              hide-details
            ></v-checkbox>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

const props = defineProps<{
  label?: string; // Made optional
  modelValue: Record<string, any>;
  items: string[];
  options: { text: string; value: any }[];
}>();

const emit = defineEmits(["update:modelValue"]);

const localValue = ref<Record<string, any>>({});

// Initialize localValue with a structure that matches items and options
onMounted(() => {
  const initialValue = { ...(props.modelValue || {}) };
  let updated = false;
  (props.items || []).forEach((item) => {
    if (!(item in initialValue)) {
      initialValue[item] = {};
      updated = true;
    }
    (props.options || []).forEach((option) => {
      if (!(option.value in initialValue[item])) {
        initialValue[item][option.value] = false; // Default to false
        updated = true;
      }
    });
  });
  localValue.value = initialValue;
  if (updated) {
    emit("update:modelValue", localValue.value);
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(localValue.value)) {
      localValue.value = { ...(newValue || {}) };
    }
  },
  { deep: true }
);

watch(
  localValue,
  (newValue) => {
    emit("update:modelValue", newValue);
  },
  { deep: true }
);

// Provide a default value for label if it's undefined
const label = computed(() => props.label || "");
</script>

<style scoped>
.checkbox-matrix-container {
  width: 100%;
}
</style>
