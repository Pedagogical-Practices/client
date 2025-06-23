<template>
  <v-text-field
    v-model="localFilter"
    label="Filtrar por nombre"
    variant="outlined"
    clearable
    prepend-inner-icon="mdi-magnify"
  ></v-text-field>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "update:filter", value: string): void;
}>();

const localFilter = ref(props.modelValue);

watch(localFilter, (newValue) => {
  emit("update:modelValue", newValue || "");
  emit("update:filter", newValue || "");
});

watch(
  () => props.modelValue,
  (newValue) => {
    localFilter.value = newValue;
  }
);
</script>

<style scoped></style>
