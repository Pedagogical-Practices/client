<template>
  <v-card>
    <v-card-title class="text-h5 primary--text">Formularios del Protocolo</v-card-title>
    <v-card-text>
      <v-list lines="two">
        <v-list-item
          v-for="formInProtocol in practice.protocol.forms"
          :key="formInProtocol._id"
          :title="formInProtocol.name"
          :subtitle="getFormStatus(formInProtocol._id).statusText"
        >
          <template v-slot:prepend>
            <v-icon :color="getFormStatus(formInProtocol._id).color">{{ getFormStatus(formInProtocol._id).icon }}</v-icon>
          </template>
          <template v-slot:append>
            <v-btn
              v-if="!getFormStatus(formInProtocol._id).isCompleted && isStudentOrFamily"
              color="primary"
              variant="flat"
              @click="fillForm(formInProtocol._id)"
            >
              Llenar Formulario
            </v-btn>
            <v-btn
              v-else-if="getFormStatus(formInProtocol._id).isCompleted"
              color="success"
              variant="outlined"
              @click="viewSubmission(getFormStatus(formInProtocol._id).submissionId)"
            >
              Ver Entrega
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  practice: {
    type: Object,
    required: true,
  },
  userRole: {
    type: String,
    required: true,
  },
});

console.log("PracticeFormList.vue: Received userRole:", props.userRole);

const router = useRouter();

const isStudentOrFamily = computed(() => {
  return props.userRole === 'student' || props.userRole === 'family';
});

const getFormStatus = (formId) => {
  const filledForm = props.practice.filledForms.find(ff => ff.form._id === formId);
  if (filledForm && filledForm.submission) {
    return {
      isCompleted: true,
      statusText: 'Completado',
      color: 'green',
      icon: 'mdi-check-circle',
      submissionId: filledForm.submission._id, // Asumiendo que submission es populado
    };
  } else {
    return {
      isCompleted: false,
      statusText: 'Pendiente',
      color: 'red',
      icon: 'mdi-alert-circle',
      submissionId: null,
    };
  }
};

const fillForm = (formId) => {
  // Redirigir al FormFiller, pasando practiceId y formId
  router.push(`/fill-form/${props.practice._id}/${formId}`);
};

const viewSubmission = (submissionId) => {
  // Redirigir a la vista de la submission (aún no implementada)
  console.log(`Ver submission: ${submissionId}`);
  // router.push(`/submissions/${submissionId}`); // Esto se implementará más adelante
};
</script>
