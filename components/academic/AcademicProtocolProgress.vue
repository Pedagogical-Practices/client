<template>
  <div>
    <v-expansion-panels v-if="protocols && protocols.length > 0" variant="accordion">
      <v-expansion-panel v-for="protocol in protocols" :key="protocol.id">
        <v-expansion-panel-title>
          <v-row no-gutters class="d-flex align-center">
            <v-col cols="8" md="6">
              <v-icon left class="mr-2">mdi-file-document-outline</v-icon>
              {{ protocol.name }}
            </v-col>
            <v-col cols="4" md="2" class="d-flex justify-end justify-md-center">
                <v-chip size="small" color="secondary" variant="tonal">
                    {{ getProtocolProgress(protocol).completedForms.length }} / {{ protocol.forms.length }} Formularios
                </v-chip>
            </v-col>
            <v-col cols="12" md="4" class="mt-2 mt-md-0 text-md-right">
                <span class="text-caption">Fecha Límite: {{ getDeadline(protocol.id) || 'No establecida' }}</span>
                <v-btn size="x-small" icon="mdi-pencil" variant="tonal" class="ms-2" @click.stop="manageDeadline(protocol)"></v-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list lines="one">
            <v-list-item
              v-for="form in protocol.forms"
              :key="form.id"
              :title="form.name"
            >
              <template v-slot:append>
                <div class="d-flex align-center">
                  <v-chip
                    :color="getFormProgress(form.id).percentage === 100 ? 'success' : 'default'"
                    class="mr-4"
                    label
                  >
                    {{ getFormProgress(form.id).submittedCount }} / {{ totalStudents }} Entregas
                  </v-chip>

                  <v-btn 
                    color="primary"
                    variant="outlined"
                    @click="viewSubmissions(form.id)"
                    :disabled="getFormProgress(form.id).submittedCount === 0"
                  >
                    Ver Entregas
                  </v-btn>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-alert v-else type="info">
      No hay protocolos asignados a esta práctica.
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Protocol, Form, Submission, GroupProtocolDeadline } from '~/types';

const props = defineProps<{
  protocols: Protocol[];
  submissions: Submission[];
  deadlines: GroupProtocolDeadline[];
  totalStudents: number;
  groupId: string;
}>();

const router = useRouter();

const submissionsByFormId = computed(() => {
  const map = new Map<string, Submission[]>();
  for (const sub of props.submissions) {
    if (sub.form && sub.form.id) {
      const formId = sub.form.id;
      if (!map.has(formId)) {
        map.set(formId, []);
      }
      map.get(formId)?.push(sub);
    }
  }
  return map;
});

const getProtocolProgress = (protocol: Protocol) => {
  const completedForms = protocol.forms.filter(form => {
    const submissions = submissionsByFormId.value.get(form.id);
    return submissions && submissions.length >= props.totalStudents;
  });
  return { completedForms };
};

const getFormProgress = (formId: string) => {
  const formSubmissions = submissionsByFormId.value.get(formId) || [];
  const submittedCount = formSubmissions.length;
  const percentage = props.totalStudents > 0 ? (submittedCount / props.totalStudents) * 100 : 0;
  return { submittedCount, percentage };
};

const getDeadline = (protocolId: string): string | null => {
  const deadline = props.deadlines.find(d => d.protocol.id === protocolId);
  if (!deadline || !deadline.endDate) return null;
  return new Date(deadline.endDate).toLocaleDateString();
};

const manageDeadline = (protocol: Protocol) => {
  // Placeholder for Phase 2 extension
  console.log(`TODO: Implementar modal para gestionar fecha límite del protocolo: ${protocol.name}`);
  alert(`Gestionar fecha para: ${protocol.name}`);
};

const viewSubmissions = (formId: string) => {
  // Navigate to the submissions history page for this form and group
  // This will be built in Phase 3
  router.push(`/academic/groups/${props.groupId}/forms/${formId}`);
};

</script>
