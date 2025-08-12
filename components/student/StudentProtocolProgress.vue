<template>
  <div>
    <v-expansion-panels v-if="protocols && protocols.length > 0" variant="accordion">
      <v-expansion-panel v-for="protocol in protocols" :key="protocol.id">
        <v-expansion-panel-title>
          <v-row no-gutters class="d-flex align-center">
            <v-col cols="8">
              <v-icon left class="mr-2">mdi-file-document-outline</v-icon>
              {{ protocol.name }}
            </v-col>
            <v-col cols="4" class="d-flex justify-end align-center">
              <span class="text-caption mr-2">{{ getProtocolProgress(protocol).completed }}/{{ getProtocolProgress(protocol).total }}</span>
              <v-progress-linear
                :model-value="getProtocolProgress(protocol).percentage"
                color="primary"
                height="8"
                rounded
              ></v-progress-linear>
            </v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list lines="two">
            <v-list-item
              v-for="form in protocol.forms"
              :key="form.id"
              :title="form.name"
            >
              <template v-slot:append>
                <div class="d-flex align-center">
                  <v-chip
                    :color="getSubmissionStatus(form.id).completed ? 'success' : 'default'"
                    class="mr-4"
                    label
                    small
                  >
                    {{ getSubmissionStatus(form.id).completed ? 'Completado' : 'Pendiente' }}
                  </v-chip>
                  <v-btn 
                    v-if="!getSubmissionStatus(form.id).completed"
                    color="primary"
                    @click="fillForm(protocol.id, form.id)"
                  >
                    Llenar Formulario
                  </v-btn>
                  <div v-else>
                     <v-btn 
                      class="mr-2"
                      variant="outlined"
                      @click="viewSubmission(getSubmissionStatus(form.id).submissionId)"
                    >
                      Ver Reporte
                    </v-btn>
                    <v-btn 
                      variant="outlined"
                      @click="editSubmission(protocol.id, form.id, getSubmissionStatus(form.id).submissionId)"
                    >
                      Editar
                    </v-btn>
                  </div>
                </div>
              </template>
              <v-list-item-subtitle v-if="getSubmissionStatus(form.id).completed">
                Última entrega: {{ formatDate(getSubmissionStatus(form.id).submissionDate) }}
              </v-list-item-subtitle>
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

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  protocols: {
    type: Array,
    required: true,
  },
  submissions: {
    type: Array,
    required: true,
    default: () => [],
  },
  groupId: {
    type: String,
    required: true,
  },
});

const router = useRouter();

const submissionsByFormId = computed(() => {
  const map = new Map();
  if (!props.submissions) return map;

  for (const sub of props.submissions) {
    // The backend now populates the form field on the submission
    if (sub.form && sub.form.id) {
      const formId = sub.form.id;
      // Keep only the latest submission for each form
      if (!map.has(formId) || new Date(sub.createdAt) > new Date(map.get(formId).createdAt)) {
        map.set(formId, sub);
      }
    }
  }
  return map;
});

const getProtocolProgress = (protocol) => {
  if (!protocol.forms || protocol.forms.length === 0) {
    return { completed: 0, total: 0, percentage: 0 };
  }
  const total = protocol.forms.length;
  const completed = protocol.forms.filter(form => submissionsByFormId.value.has(form.id)).length;
  return {
    completed,
    total,
    percentage: total > 0 ? (completed / total) * 100 : 0,
  };
};

const getSubmissionStatus = (formId) => {
  const submission = submissionsByFormId.value.get(formId);
  if (submission) {
    return {
      completed: true,
      submissionId: submission.id,
      submissionDate: submission.createdAt,
    };
  }
  return { completed: false };
};

const fillForm = (protocolId, formId) => {
  router.push(`/fill-form/${props.groupId}/${protocolId}/${formId}`);
};

const viewSubmission = (submissionId) => {
  router.push(`/submissions/${submissionId}`);
};

const editSubmission = (protocolId, formId, submissionId) => {
  router.push(`/fill-form/${props.groupId}/${protocolId}/${formId}?submissionId=${submissionId}`);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

</script>
