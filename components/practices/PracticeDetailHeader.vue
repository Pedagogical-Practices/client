<template>
  <v-card class="mb-4">
    <v-card-title class="text-h5 primary--text">Detalles de la Práctica</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <p class="text-subtitle-1"><strong>Curso:</strong> {{ practice.courseName }}</p>
          <p class="text-subtitle-1"><strong>Institución:</strong> {{ practice.institutionName }}</p>
          <p class="text-subtitle-1"><strong>Protocolo:</strong> {{ practice.protocol.name }}</p>
        </v-col>
        <v-col cols="12" md="6">
          <p class="text-subtitle-1"><strong>Estudiante:</strong> {{ practice.student.name }}</p>
          <p class="text-subtitle-1"><strong>Asesor:</strong> {{ practice.advisor.name }}</p>
          <p class="text-subtitle-1"><strong>Estado:</strong>
            <v-chip :color="statusColor(practice.status)" dark class="ml-2">{{ practice.status }}</v-chip>
          </p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  practice: {
    type: Object,
    required: true,
  },
});

const statusColor = (status) => {
  switch (status) {
    case 'ASSIGNED': return 'blue';
    case 'IN_PROGRESS': return 'orange';
    case 'COMPLETED': return 'green';
    case 'REVIEWED': return 'purple';
    default: return 'grey';
  }
};
</script>
