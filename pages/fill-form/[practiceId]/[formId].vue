<template>
  <v-container>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      top
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 primary--text">Llenar Formulario</h2>
        <p v-if="formStore.currentForm">
          Formulario: {{ formStore.currentForm.name }}
        </p>

        <FormFiller
          v-if="formStore.currentForm"
          :formDefinition="formStore.currentForm"
          :initialData="submissionStore.currentSubmission?.formData"
          :submissionId="submissionStore.currentSubmission?.id"
          @submit="handleSubmit"
          @update="handleUpdate"
        />
        <p v-else>Cargando formulario...</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFormStore } from "~/stores/formStore";
import { usePracticeStore } from "~/stores/practiceStore";
import { useSubmissionStore } from "~/stores/submissionStore";
import { useAuthStore } from "~/stores/authStore";
import FormFiller from "~/components/FormFiller.vue";

const route = useRoute();
const router = useRouter();
const practiceId = ref(route.params.practiceId as string);
const protocolId = ref(route.params.formId as string); // Renamed formId to protocolId
const submissionId = ref(route.query.submissionId as string | undefined);
const formStore = useFormStore();
const practiceStore = usePracticeStore();
const submissionStore = useSubmissionStore();
const authStore = useAuthStore();

const snackbar = ref({
  show: false,
  message: "",
  color: "",
  timeout: 3000,
});

const showSnackbar = (message: string, color: string) => {
  snackbar.value.message = message;
  snackbar.value.color = color;
  snackbar.value.show = true;
};

onMounted(async () => {
  if (protocolId.value) {
    await formStore.fetchForm(protocolId.value);
  }
  if (practiceId.value) {
    await practiceStore.fetchPractice(practiceId.value);
    console.log(
      "Practice fetched in fill-form page:",
      practiceStore.currentPractice
    );

    if (submissionId.value) {
      await submissionStore.fetchSubmission(submissionId.value);
      console.log("Existing submission loaded for editing:", submissionStore.currentSubmission);
    } else {
      submissionStore.setCurrentSubmission(null);
      if (authStore.user?.role === 'STUDENT') {
        submissionStore.setCurrentSubmission({
          formData: { docenteFormacion: authStore.user.id },
        });
      }
    }
  }
});

const handleSubmit = async (formData: Record<string, any>) => {
  if (!protocolId.value || !practiceId.value || !authStore.user) return;
  try {
    await submissionStore.createSubmission({
      practiceId: practiceId.value,
      protocolId: protocolId.value,
      formData: formData,
    });
    await practiceStore.fetchPractice(practiceId.value); // Forzar recarga
    showSnackbar("Formulario enviado exitosamente!", "success");
    router.push(`/practices/${practiceId.value}`);
  } catch (error: any) {
    console.error("Error submitting form:", error);
    showSnackbar(`Error al enviar formulario: ${error.message}`, "error");
  }
};

const handleUpdate = async ({ id, data }: { id: string; data: Record<string, any> }) => {
  if (!id) return;
  try {
    await submissionStore.updateSubmission(id, { formData: data });
    await practiceStore.fetchPractice(practiceId.value); // Forzar recarga
    showSnackbar("Formulario actualizado exitosamente!", "success");
    router.push(`/practices/${practiceId.value}`);
  } catch (error: any) {
    console.error("Error updating form:", error);
    showSnackbar(`Error al actualizar formulario: ${error.message}`, "error");
  }
};
</script>