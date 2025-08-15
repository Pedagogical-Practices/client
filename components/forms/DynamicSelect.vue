<template>
  <EntityAutocomplete
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :specificType="field.dataSource ?? ''"
    :label="field.label"
    :multiple="field.multiple"
  />
</template>

<script setup lang="ts">
import EntityAutocomplete from "~/components/EntityAutocomplete.vue";
import type { FormField } from "~/types";

defineProps<{
  modelValue: any;
  field: FormField;
}>();

const emit = defineEmits(["update:modelValue"]);
</script>
