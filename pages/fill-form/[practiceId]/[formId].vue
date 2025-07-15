<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 primary--text">Llenar Formulario</h2>
        <p v-if="formStore.currentForm">Formulario: {{ formStore.currentForm.name }}</p>

        <FormFiller
          v-if="formStore.currentForm"
          :formDefinition="formStore.currentForm"
          :initialData="submissionStore.currentSubmission?.data"
          :submissionId="submissionStore.currentSubmission?._id"
          @submit="handleSubmit"
          @update="handleUpdate"
        />
        <p v-else>Cargando formulario...</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFormStore } from '~/stores/formStores';
import { usePracticeStore } from '~/stores/practiceStore';
import { useSubmissionStore } from '~/stores/submissionStore';
import { useAuthStore } from '~/stores/authStore';
import FormFiller from '~/components/FormFiller.vue';

const route = useRoute();
const router = useRouter();
const practiceId = ref(route.params.practiceId);
const formId = ref(route.params.formId);
const formStore = useFormStore();
const practiceStore = usePracticeStore();
const submissionStore = useSubmissionStore();
const authStore = useAuthStore();

const snackbar = ref({
  show: false,
  message: '',
  color: '',
  timeout: 3000,
});

const showSnackbar = (message, color) => {
  snackbar.value.message = message;
  snackbar.value.color = color;
  snackbar.value.show = true;
};

onMounted(async () => {
  if (formId.value) {
    await formStore.fetchForm(formId.value);
  }
  if (practiceId.value) {
    await practiceStore.fetchPractice(practiceId.value);
    console.log("Practice fetched in fill-form page:", practiceStore.currentPractice);
    // Find if a submission already exists for this form
    const existingSubmission = practiceStore.currentPractice?.filledForms.find(ff => ff.form._id === formId.value)?.submission;
    console.log("Existing submission found (after find):", existingSubmission);
    if (existingSubmission) {
      submissionStore.setCurrentSubmission(existingSubmission);
      console.log("submissionStore.currentSubmission after setting:", submissionStore.currentSubmission);
    }
  }
});

const handleSubmit = async (formData) => {
  if (!formId.value || !practiceId.value || !authStore.user) return;
  try {
    await submissionStore.createSubmission(practiceId.value, formId.value, formData);
    await practiceStore.fetchPractice(practiceId.value); // Forzar recarga
    alert("Formulario enviado exitosamente!");
    router.push(`/practices/${practiceId.value}`);
  } catch (error) {
    console.error("Error submitting form:", error);
    alert(`Error al enviar formulario: ${error.message}`);
  }
};

const handleUpdate = async ({ id, data }) => {
  if (!id) return;
  try {
    await submissionStore.updateSubmission(id, data);
    await practiceStore.fetchPractice(practiceId.value); // Forzar recarga
    alert("Formulario actualizado exitosamente!");
    router.push(`/practices/${practiceId.value}`);
  } catch (error) {
    console.error("Error updating form:", error);
    alert(`Error al actualizar formulario: ${error.message}`);
  }
};
</script>
