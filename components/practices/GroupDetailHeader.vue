<template>
  <v-card class="mb-4">
    <v-card-title class="text-h5 primary--text">Detalles del Grupo</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <p class="text-subtitle-1"><strong>Curso:</strong> {{ group.course.name }}</p>
          <p class="text-subtitle-1"><strong>Protocolo:</strong>
            <span v-if="group.protocols && group.protocols.length > 0">
              {{ group.protocols[0].name }}
            </span>
            <span v-else>N/A</span>
          </p>
        </v-col>
        <v-col cols="12" md="6">
          <p class="text-subtitle-1"><strong>Estudiante:</strong> {{ group.student.name }}</p>
          <p class="text-subtitle-1"><strong>Asesor:</strong> {{ group.teacher.name }}</p>
          <p class="text-subtitle-1"><strong>Estado:</strong>
            <v-chip :color="statusColor(group.status)" dark class="ml-2">{{ group.status }}</v-chip>
          </p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  group: any;
}>();

const statusColor = (status: any) => {
  switch (status) {
    case PracticeStatus.PENDING: return 'blue';
    case PracticeStatus.IN_PROGRESS: return 'orange';
    case PracticeStatus.COMPLETED: return 'green';
    case PracticeStatus.ARCHIVED: return 'grey';
    default: return 'grey';
  }
};
</script>
