<template>
  <v-container>
    <v-card v-if="!loading && form">
      <v-card-title class="headline">{{ form.name }}</v-card-title>
      <v-card-subtitle v-if="form.description">{{
        form.description
      }}</v-card-subtitle>
      <v-divider></v-divider>

      <v-card-text>
        <FormViewer v-if="form" :form-definition="form" v-model="formData" />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" @click="() => router.back()">Cancelar</v-btn>
        <v-btn color="primary" @click="handleSubmit" :loading="isSubmitting">
          {{ submissionId ? "Actualizar Entrega" : "Guardar Entrega" }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <div v-if="loading" class="text-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p>Cargando formulario...</p>
    </div>

    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/authStore";
import { useDataSourceStore } from "~/stores/dataSourceStore";
import { useFormStore } from "~/stores/formStore";
import { useSubmissionStore } from "~/stores/submissionStore";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import FormViewer from "~/components/FormViewer.vue";
import type { Form } from "~/components/FormViewer.vue";
import { FormFieldType, DataSourceType } from "~/types";

const route = useRoute();
const router = useRouter();
const formStore = useFormStore();
const dataSourceStore = useDataSourceStore();
const submissionStore = useSubmissionStore();
const authStore = useAuthStore();

const form = ref<Form | null>(null);
const formData = ref<Record<string, any>>({});
const loading = ref(true);
const isSubmitting = ref(false);
const error = ref<string | null>(null);
const snackbar = ref({ show: false, text: "", color: "" });

const groupId = route.params.groupId as string;
const formId = route.params.formId as string;
const protocolId = route.query.protocolId as string;
const submissionId = route.query.submissionId as string | undefined;

const loadData = async () => {
  try {
    loading.value = true;
    // Fetch form definition
    await formStore.fetchFormById(formId);
    if (formStore.currentForm) {
      form.value = formStore.currentForm;
    } else {
      throw new Error(`No se pudo encontrar el formulario con ID: ${formId}`);
    }

    // If editing, fetch existing submission data
    if (submissionId) {
      await submissionStore.fetchSubmission(submissionId);
      if (submissionStore.currentSubmission) {
        formData.value = { ...submissionStore.currentSubmission.formData };
      } else {
        throw new Error(
          `No se pudo encontrar la entrega con ID: ${submissionId}`
        );
      }
    } else {
      // Pre-fill student name for new submissions
      const studentNameField = form.value.fields.find(
        (f) => f.dataSource === "STUDENTS"
      );
      if (studentNameField && authStore.user) {
        formData.value[studentNameField.name] = authStore.user.id;
      }
    }
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  if (!form.value) return;
  isSubmitting.value = true;

  try {
    // Denormalize dynamic select values and format dates before submission
          const dataToSubmit = { ...formData.value };
          if (form.value && form.value.fields) {
            for (const field of form.value.fields) {
              const fieldValue = dataToSubmit[field.name];

              // Handle SELECT_DYNAMIC denormalization
              if (field.type === FormFieldType.SELECT_DYNAMIC && fieldValue) {
                // Only fetch if it's an ID (string), not already denormalized object
                if (typeof fieldValue === 'string') {
                  const fetchedOption = await dataSourceStore.fetchOptionById(field.dataSource as DataSourceType, fieldValue);
                  if (fetchedOption) {
                    dataToSubmit[field.name] = { id: fetchedOption.value, text: fetchedOption.title };
                  }
                }
              }

              // Handle Date objects conversion to ISO strings
              if ( (field.type === FormFieldType.DATE || field.type === FormFieldType.DATE_INPUT || field.type === FormFieldType.DATE_PICKER) && fieldValue instanceof Date) {
                dataToSubmit[field.name] = fieldValue.toISOString();
              }
            }
          }

    if (submissionId) {
      // Update existing submission
      await submissionStore.updateSubmission(submissionId, dataToSubmit);
      snackbar.value = {
        show: true,
        text: "Entrega actualizada con éxito",
        color: "success",
      };
    } else {
      // Create new submission
      if (!protocolId) {
        throw new Error(
          "El ID del protocolo es requerido para crear una nueva entrega."
        );
      }
      const studentId = authStore.user?.id;
      if (!studentId) {
        throw new Error(
          "No se pudo identificar al estudiante. Por favor, inicie sesión de nuevo."
        );
      }

      // For now, we assume the submission is individual.
      // Group submission logic would require getting all student IDs from the group.
      const studentIds = [studentId];

      await submissionStore.createSubmission({
        groupId,
        protocolId,
        formId,
        studentIds,
        formData: dataToSubmit,
      });
      snackbar.value = {
        show: true,
        text: "Formulario guardado con éxito",
        color: "success",
      };
    }
    // Navigate back or to a confirmation page after a short delay
    setTimeout(() => router.back(), 1500);
  } catch (e: any) {
    error.value = e.message;
    snackbar.value = {
      show: true,
      text: `Error: ${e.message}`,
      color: "error",
    };
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(loadData);
</script>
