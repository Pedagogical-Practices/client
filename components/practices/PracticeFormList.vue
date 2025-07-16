<template>
  <v-card>
    <v-card-title class="text-h5 primary--text"
      >Formularios del Protocolo</v-card-title
    >
    <v-card-text>
      <v-list lines="two">
        <v-list-item
          v-for="formInProtocol in practice.protocol.forms"
          :key="formInProtocol._id"
          :title="formInProtocol.name"
          :subtitle="getFormStatus(formInProtocol._id).statusText"
        >
          <template v-slot:prepend>
            <v-icon :color="getFormStatus(formInProtocol._id).color">{{
              getFormStatus(formInProtocol._id).icon
            }}</v-icon>
          </template>
          <template v-slot:append>
            <v-btn
              v-if="!getFormStatus(formInProtocol._id).isCompleted && isStudentOrFamily"
              color="primary"
              variant="flat"
              @click="fillForm(formInProtocol._id)"
            >
              <v-icon left>mdi-file-edit-outline</v-icon>
              Llenar Formulario
            </v-btn>
            <div v-else-if="getFormStatus(formInProtocol._id).isCompleted">
              <v-btn
                color="success"
                variant="outlined"
                @click="viewSubmission(getFormStatus(formInProtocol._id).submission._id)"
              >
                <v-icon left>mdi-file-document-outline</v-icon>
                Ver Reporte
              </v-btn>
              <v-btn
                color="info"
                variant="text"
                @click="fillForm(formInProtocol._id)"
                class="ml-2"
              >
                <v-icon left>mdi-plus-box</v-icon>
                Llenar Nuevo Formulario
              </v-btn>
            </div>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { defineProps, computed } from "vue";
import { useRouter } from "vue-router";

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
  return props.userRole === "student" || props.userRole === "family";
});

const getFormStatus = (formId) => {
  const filledForm = props.practice.filledForms.find(
    (ff) => ff.form._id === formId
  );
  if (filledForm && filledForm.submission) {
    return {
      isCompleted: true,
      statusText: `Completado (${new Date(filledForm.submission.createdAt).toLocaleDateString()})`, // Show submission date
      color: "green",
      icon: "mdi-check-circle",
      submission: filledForm.submission, // Return the full submission object
    };
  } else {
    return {
      isCompleted: false,
      statusText: "Pendiente",
      color: "red",
      icon: "mdi-alert-circle",
      submissionId: null,
    };
  }
};

const fillForm = (formId) => {
  console.log("PracticeFormList.vue: fillForm called with formId:", formId);
  router.push(`/fill-form/${props.practice._id}/${formId}`);
};

const viewSubmission = (submissionId) => {
  console.log("PracticeFormList.vue: viewSubmission called with submissionId:", submissionId);
  router.push(`/submissions/${submissionId}`);
};

// Log each form in protocol to inspect their IDs
props.practice.protocol.forms.forEach((form) => {
  console.log(
    "PracticeFormList.vue: Form in protocol - ID:",
    form._id,
    "Name:",
    form.name
  );
});
</script>