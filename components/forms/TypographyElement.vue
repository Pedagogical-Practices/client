<template>
  <div :class="styleClasses">
    {{ text }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  text: string;
  variant: string;
  fontWeight?: string;
  textAlign?: string;
  textDecoration?: string;
  textTransform?: string;
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
