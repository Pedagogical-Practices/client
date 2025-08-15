<template>
  <component :is="tag || 'div'" :class="styleClasses">
    {{ value }}
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  value: string; // Changed from text to value
  variant: string;
  fontWeight?: string;
  textAlign?: string;
  textDecoration?: string;
  textTransform?: string;
  tag?: string; // Prop for semantic HTML tag
}>();

const styleClasses = computed(() => {
  return [
    props.variant,
    props.fontWeight,
    props.textAlign,
    props.textDecoration,
    props.textTransform,
  ].filter(Boolean); // Filter out any null/undefined values
});
</script>

<style scoped>
/* Add any specific styles for the wrapper if needed */
</style>
