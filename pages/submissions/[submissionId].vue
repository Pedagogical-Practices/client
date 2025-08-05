<template>
  <v-container v-if="submissionStore.currentSubmission">
    <v-card class="pa-4">
      <v-card-title class="text-h5 primary--text">Reporte de Entrega</v-card-title>
      <v-card-subtitle>Protocolo: {{ submissionStore.currentSubmission.protocol.name }}</v-card-subtitle>
      <v-card-text>
        <v-list dense>
          <v-list-item v-for="(value, key) in displayData" :key="key">
            <v-list-item-title class="font-weight-bold">{{ formatKey(key) }}:</v-list-item-title>
            <v-list-item-subtitle>{{ value }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <v-divider class="my-4"></v-divider>

        <h3 class="text-h6">Evaluación</h3>
        <p><strong>Puntuación:</strong> {{ submissionStore.currentSubmission.score ?? 'N/A' }}</p>
        <p><strong>Retroalimentación:</strong> {{ submissionStore.currentSubmission.feedback ?? 'N/A' }}</p>

      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="editSubmission"
        >
          <v-icon left>mdi-pencil</v-icon>
          Editar
        </v-btn>
        <v-btn
          color="secondary"
          @click="generatePdf"
        >
          <v-icon left>mdi-file-pdf-box</v-icon>
          Generar PDF
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
  <v-container v-else>
    <v-row>
      <v-col cols="12">
        <p>Cargando reporte de entrega...</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSubmissionStore } from '~/stores/submissionStore';
import { useFormStore } from '~/stores/formStore';
import { useAuthStore } from '~/stores/authStore';

const route = useRoute();
const router = useRouter();
const submissionStore = useSubmissionStore();
const formStore = useFormStore();
const authStore = useAuthStore();

onMounted(async () => {
  const submissionId = route.params.submissionId as string;
  if (submissionId) {
    await submissionStore.fetchSubmission(submissionId);
    if (submissionStore.currentSubmission?.protocol?.form?.id) {
      await formStore.fetchForm(submissionStore.currentSubmission.protocol.form.id);
    }
  }
});

const formatKey = (key: string) => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
};

const formatValue = (key: string, value: any) => {
  if (key === 'docenteFormacion' && value) {
    // Assuming value is a user ID and we have user data available
    const user = authStore.users.find(u => u.id === value);
    return user ? user.name : value;
  }

  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }
  return value;
};

const displayData = computed(() => {
  const data: Record<string, any> = {};
  if (submissionStore.currentSubmission?.formData) {
    for (const key in submissionStore.currentSubmission.formData) {
      data[key] = formatValue(key, submissionStore.currentSubmission.formData[key]);
    }
  }
  return data;
});

const editSubmission = () => {
  if (submissionStore.currentSubmission) {
    const { id: submissionId, group, protocol } = submissionStore.currentSubmission;
    const groupId = group.id;
    const formId = protocol.form.id;
    router.push(`/fill-form/${groupId}/${formId}?submissionId=${submissionId}`);
  }
};

const generatePdf = async () => {
  if (submissionStore.currentSubmission?.id) {
    try {
      const pdfBase64 = await submissionStore.generateSubmissionPdf(submissionStore.currentSubmission.id);
      if (pdfBase64) {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${pdfBase64}`;
        link.download = `reporte_${submissionStore.currentSubmission.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Optionally, show an error message to the user
    }
  }
};
</script>