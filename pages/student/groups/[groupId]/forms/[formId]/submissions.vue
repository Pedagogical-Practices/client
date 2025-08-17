<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-btn @click="goBack" color="grey" class="mb-4">
          <v-icon left>mdi-arrow-left</v-icon>
          Volver al Progreso
        </v-btn>
        <v-card>
          <v-card-title class="text-h5">
            Historial de Envíos para: {{ formName }}
          </v-card-title>
          <v-divider></v-divider>

          <div v-if="submissionStore.isLoading" class="text-center pa-4">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>

          <v-alert v-else-if="submissionStore.error" type="error" class="ma-4">
            Error al cargar el historial: {{ submissionStore.error.message }}
          </v-alert>

          <v-list v-else-if="history.length > 0" lines="two">
            <v-list-item v-for="submission in history" :key="submission.id">
              <v-list-item-title>
                Entrega del {{ formatDate(submission.createdAt) }}
              </v-list-item-title>
              <v-list-item-subtitle>
                Enviado por: {{ submission.students.map(s => `${s.firstName} ${s.lastName}`).join(', ') }}
              </v-list-item-subtitle>

              <template v-slot:append>
                <v-btn 
                  color="primary"
                  variant="outlined"
                  @click="viewSubmission(submission.id)"
                >
                  Ver / Editar
                </v-btn>
              </template>
            </v-list-item>
          </v-list>

          <v-card-text v-else class="text-center pa-4">
            No se han encontrado entregas para este formulario.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSubmissionStore } from '~/stores/submissionStore';
import { useFormStore } from '~/stores/formStore';

definePageMeta({
  middleware: 'auth',
});

const route = useRoute();
const router = useRouter();
const submissionStore = useSubmissionStore();
const formStore = useFormStore();

const groupId = route.params.groupId;
const formId = route.params.formId;
const protocolId = computed(() => submissionStore.formSubmissionsHistory[0]?.protocol?.id || route.params.protocolId); // A bit of a hack to get protocolId if available

const history = computed(() => submissionStore.formSubmissionsHistory);
const formName = computed(() => formStore.currentForm?.name || 'Formulario');

onMounted(async () => {
  if (groupId && formId) {
    await Promise.all([
      submissionStore.fetchSubmissionsByFormAndGroup(groupId, formId),
      formStore.fetchFormById(formId) // Fetch form details to display the name
    ]);
  }
});

const viewSubmission = (submissionId) => {
  // Navigate to the fill-form page in edit mode
  router.push(`/fill-form/${groupId}/${protocolId.value}/${formId}?submissionId=${submissionId}`);
};

const goBack = () => {
  router.push(`/student/my-groups/${groupId}`);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>
