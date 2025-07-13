<template>
  <v-container>
    <v-row>
      <v-col v-for="practice in practices" :key="practice._id" cols="12" md="6" lg="4">
        <v-card>
          <v-card-title>{{ practice.courseName }}</v-card-title>
          <v-card-subtitle>{{ practice.institutionName }}</v-card-subtitle>
          <v-card-text>
            <p><strong>Estudiante:</strong> {{ practice.student.name }}</p>
            <p><strong>Protocolo:</strong> {{ practice.protocol.name }}</p>
            <v-chip :color="statusColor(practice.status)" dark>{{ practice.status }}</v-chip>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="viewPractice(practice._id)">Revisar Práctica</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

defineProps({
  practices: {
    type: Array,
    required: true,
  },
});

const router = useRouter();

const statusColor = (status) => {
  switch (status) {
    case 'ASSIGNED': return 'blue';
    case 'IN_PROGRESS': return 'orange';
    case 'COMPLETED': return 'green';
    case 'REVIEWED': return 'purple';
    default: return 'grey';
  }
};

const viewPractice = (id) => {
  router.push(`/admin/practices/${id}`); // Reutilizamos la vista de detalle del admin
};
</script>
