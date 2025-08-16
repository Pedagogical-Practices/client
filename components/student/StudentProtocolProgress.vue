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
                    :color="getFormStatus(form.id).count > 0 ? 'success' : 'default'"
                    class="mr-4"
                    label
                    small
                  >
                    {{ getFormStatus(form.id).count > 0 ? `${getFormStatus(form.id).count} Entrega(s)` : 'Pendiente' }}
                  </v-chip>

                  <!-- No submissions yet -->
                  <v-btn 
                    v-if="getFormStatus(form.id).count === 0"
                    color="primary"
                    @click="fillNewForm(protocol.id, form.id)"
                    :disabled="isPastDeadline(protocol.id)"
                  >
                    Llenar Formulario
                  </v-btn>

                  <!-- One or more submissions -->
                  <div v-else>
                     <v-btn 
                      class="mr-2"
                      variant="outlined"
                      color="info"
                      @click="viewHistory(protocol.id, form.id)"
                    >
                      Ver Historial
                    </v-btn>
                    <v-btn 
                      class="mr-2"
                      variant="outlined"
                      @click="editSubmission(protocol.id, form.id, getFormStatus(form.id).latest.id)"
                    >
                      Editar Último
                    </v-btn>
                     <v-btn 
                      color="primary"
                      @click="fillNewForm(protocol.id, form.id)"
                      :disabled="isPastDeadline(protocol.id)"
                    >
                      Llenar Nuevo
                    </v-btn>
                  </div>
                </div>
              </template>
              <v-list-item-subtitle v-if="getFormStatus(form.id).count > 0">
                Última entrega: {{ formatDate(getFormStatus(form.id).latest.createdAt) }}
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
  deadlines: { // New prop for deadlines
    type: Array,
    required: false,
    default: () => [],
  },
  groupId: {
    type: String,
    required: true,
  },
});

const router = useRouter();

// This computed property now groups all submissions by formId
const submissionsByFormId = computed(() => {
  const map = new Map();
  if (!props.submissions) return map;

  for (const sub of props.submissions) {
    if (sub.form && sub.form.id) {
      const formId = sub.form.id;
      if (!map.has(formId)) {
        map.set(formId, []);
      }
      map.get(formId).push(sub);
    }
  }

  // Sort submissions within each form entry by date, descending
  for (const [formId, subs] of map.entries()) {
    subs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

// Renamed and enhanced function to get status for a form
const getFormStatus = (formId) => {
  const formSubmissions = submissionsByFormId.value.get(formId);
  if (formSubmissions && formSubmissions.length > 0) {
    return {
      count: formSubmissions.length,
      latest: formSubmissions[0], // The latest is the first after sorting
    };
  }
  return { count: 0 };
};

const isPastDeadline = (protocolId) => {
  if (!props.deadlines) return false;
  const deadline = props.deadlines.find(d => d.protocol.id === protocolId);
  if (deadline && deadline.endDate) {
    return new Date() > new Date(deadline.endDate);
  }
  return false; // If no deadline is set, allow submission
};

const fillNewForm = (protocolId, formId) => {
  router.push(`/fill-form/${props.groupId}/${formId}?protocolId=${protocolId}`);
};

const viewHistory = (protocolId, formId) => {
  // Navigate to a new history page (to be created in Step 4)
  router.push(`/student/groups/${props.groupId}/forms/${formId}/submissions`);
};

const editSubmission = (protocolId, formId, submissionId) => {
  router.push(`/fill-form/${props.groupId}/${formId}?protocolId=${protocolId}&submissionId=${submissionId}`);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

</script>
