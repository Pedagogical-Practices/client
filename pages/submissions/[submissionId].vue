<template>
  <v-container v-if="submissionStore.currentSubmission">
    <v-card class="pa-4">
      <v-card-title class="text-h5 primary--text">Reporte de Entrega</v-card-title>
      <v-card-subtitle>Formulario: {{ formStore.currentForm?.name }}</v-card-subtitle>
      <v-card-text>
        <v-list dense>
          <v-list-item v-for="(value, key) in displayData" :key="key">
            <v-list-item-title class="font-weight-bold">{{ formatKey(key) }}:</v-list-item-title>
            <v-list-item-subtitle>{{ value }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
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
          @click="printReport"
        >
          <v-icon left>mdi-printer</v-icon>
          Imprimir
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
import { onMounted, ref, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSubmissionStore } from '~/stores/submissionStore';
import { useFormStore } from '~/stores/formStores';
import { useAuthStore } from '~/stores/authStore';

const route = useRoute();
const router = useRouter();
const submissionStore = useSubmissionStore();
const formStore = useFormStore();
const authStore = useAuthStore();

const userNames = reactive<{ [key: string]: string }>({});

onMounted(async () => {
  const submissionId = route.params.submissionId as string;
  if (submissionId) {
    await submissionStore.fetchSubmission(submissionId);
    if (submissionStore.currentSubmission?.formId) {
      await formStore.fetchForm(submissionStore.currentSubmission.formId);
    }
    // Fetch all users to populate userNames map
    await authStore.fetchUsers();
    authStore.users.forEach(user => {
      userNames[user._id] = user.name;
    });
  }
});

const formatKey = (key: string) => {
  // Simple formatting: capitalize first letter and replace camelCase with spaces
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
};

const formatValue = (key: string, value: any) => {
  if (key === 'docenteFormacion' && value) {
    return userNames[value] || value; // Return name if found, otherwise ID
  }

  if (typeof value === 'object' && value !== null) {
    // Handle dates
    if (value.hasOwnProperty('$date')) {
      const date = new Date(value.$date.$numberLong ? parseInt(value.$date.$numberLong) : value.$date);
      return date.toLocaleDateString(); // Formato solo año, mes y día
    }
    // Handle other objects (e.g., arrays, nested objects) as JSON string for now
    return JSON.stringify(value);
  }
  return value;
};

const displayData = computed(() => {
  const data: Record<string, any> = {};
  if (submissionStore.currentSubmission?.data) {
    for (const key in submissionStore.currentSubmission.data) {
      data[key] = formatValue(key, submissionStore.currentSubmission.data[key]);
    }
  }
  return data;
});

const editSubmission = () => {
  if (submissionStore.currentSubmission) {
    const { formId, _id: submissionId } = submissionStore.currentSubmission;
    // Use route.params.practiceId as a fallback if submission.practiceId is null
    const practiceId = submissionStore.currentSubmission.practiceId || route.params.practiceId;
    router.push(`/fill-form/${practiceId}/${formId}?submissionId=${submissionId}`);
  }
};

const printReport = () => {
  window.print();
};
</script>