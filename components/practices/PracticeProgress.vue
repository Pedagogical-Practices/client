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
        <strong>{{ protocolsCompleted }} de {{ totalProtocols }} protocolos completados ({{ progressPercentage.toFixed(0) }}%)</strong>
      </v-progress-linear>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { Practice } from '~/server/src/practice/schemas/practice.schema';

const props = defineProps<{
  practice: Practice;
}>();

const totalProtocols = computed(() => props.practice.protocols.length);
const protocolsCompleted = computed(() => {
  return props.practice.submissions.length;
});

const progressPercentage = computed(() => {
  if (totalProtocols.value === 0) return 0;
  return (protocolsCompleted.value / totalProtocols.value) * 100;
});
</script>
