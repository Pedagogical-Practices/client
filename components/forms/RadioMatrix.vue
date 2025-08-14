<template>
  <div class="radio-matrix-container pa-2 border rounded">
    <v-label>{{ label }}</v-label>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left">Item</th>
          <th class="text-center">Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item">
          <td>{{ item }}</td>
          <td>
            <v-radio-group v-model="localValue[item]" inline>
              <v-radio
                v-for="option in options"
                :key="option.value"
                :label="option.text"
                :value="option.value"
              ></v-radio>
            </v-radio-group>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps<{
  label?: string; // Made optional
  modelValue: Record<string, any>;
  items: string[];
  options: { text: string; value: any }[];
}>();

const emit = defineEmits(["update:modelValue"]);

const localValue = ref<Record<string, any>>({});

// Initialize localValue with keys from items if they don't exist
onMounted(() => {
  const initialValue = { ...(props.modelValue || {}) };
  let updated = false;
  (props.items || []).forEach((item) => {
    if (!(item in initialValue)) {
      initialValue[item] = null; // Default to null
      updated = true;
    }
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
.radio-matrix-container {
  width: 100%;
}
</style>
