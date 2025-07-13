<template>
  <v-card class="mb-4">
    <v-card-title class="text-h5 primary--text">Progreso de la Práctica</v-card-title>
    <v-card-text>
      <v-progress-linear
        :model-value="progressPercentage"
        color="primary"
        height="20"
        rounded
      >
        <strong>{{ formsCompleted }} de {{ totalForms }} formularios completados ({{ progressPercentage.toFixed(0) }}%)</strong>
      </v-progress-linear>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  practice: {
    type: Object,
    required: true,
  },
});

const totalForms = computed(() => props.practice.protocol.forms.length);
const formsCompleted = computed(() => {
  return props.practice.filledForms.filter(ff => ff.submission).length;
});

const progressPercentage = computed(() => {
  if (totalForms.value === 0) return 0;
  return (formsCompleted.value / totalForms.value) * 100;
});
</script>
