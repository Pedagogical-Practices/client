<template>
  <div>
    <v-expansion-panels v-if="protocols && protocols.length > 0" variant="accordion">
      <v-expansion-panel v-for="protocol in protocols" :key="protocol.id">
        <v-expansion-panel-title>
          <v-icon left class="mr-2">mdi-file-document-outline</v-icon>
          {{ protocol.name }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list lines="one">
            <v-list-item v-for="form in protocol.forms" :key="form.id" :title="form.name">
              <template v-slot:append>
                <div class="d-flex align-center">
                  <v-chip
                    :color="getFormStatus(form.id).hasSubmission ? 'success' : 'default'"
                    class="mr-4"
                    label
                    small
                  >
                    {{ getFormStatus(form.id).hasSubmission ? "Entregado" : "Pendiente" }}
                  </v-chip>

                  <v-btn
                    variant="tonal"
                    @click="viewReport(getFormStatus(form.id).submissionId)"
                    :disabled="!getFormStatus(form.id).hasSubmission"
                  >
                    Ver Reporte
                  </v-btn>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-alert v-else type="info">No hay protocolos asignados a esta práctica.</v-alert>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Protocol, Submission } from '~/types';

const props = defineProps<{
  protocols: Protocol[];
  submissions: Submission[];
}>();

const router = useRouter();

// For debugging the status issue, log the received submissions.
console.log('TutorStudentProgress received submissions:', props.submissions);

const submissionsByFormId = computed(() => {
  const map = new Map<string, Submission>();
  if (!props.submissions) return map;

  for (const sub of props.submissions) {
    if (sub.form && sub.form.id) {
      // Since this component shows one student's progress, we don't need to sort by date.
      // We just map the formId to the single submission object.
      map.set(sub.form.id, sub);
    }
  }
  return map;
});

const getFormStatus = (formId: string) => {
  const submission = submissionsByFormId.value.get(formId);
  if (submission) {
    return {
      hasSubmission: true,
      submissionId: submission.id,
    };
  }
  return { hasSubmission: false, submissionId: null };
};

const viewReport = (submissionId: string | null) => {
  if (!submissionId) return;
  router.push(`/academic/submissions/report/${submissionId}`);
};
</script>
