<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Protocolo: {{ protocolStore.currentProtocol?.name }}</span>
            <v-btn
              color="primary"
              @click="submitProtocol"
              prepend-icon="mdi-content-save"
            >
              Enviar Protocolo
            </v-btn>
          </v-card-title>
          <v-card-text>
            <FormFiller
              v-if="formStore.currentForm"
              :formDefinition="formStore.currentForm"
              v-model="formData"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="top right"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFormStore } from "~/stores/formStore";
import { useProtocolStore } from "~/stores/protocolStore";
import { useSubmissionStore } from "~/stores/submissionStore";
import FormFiller from "~/components/FormFiller.vue";
import { useAuthStore } from "~/stores/authStore";

// definePageMeta({});

const route = useRoute();
const router = useRouter();

const formStore = useFormStore();
const protocolStore = useProtocolStore();
const submissionStore = useSubmissionStore();
const authStore = useAuthStore();
const formData = ref({});
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

onMounted(async () => {
  const protocolId = route.params.id as string;
  await protocolStore.fetchProtocol(protocolId);
  if (protocolStore.currentProtocol?.form?.id) {
    await formStore.fetchFormById(protocolStore.currentProtocol.form.id);
  }
});

const submitProtocol = async () => {
  try {
    // Assuming the user is a student and belongs to a group
    // You might need to fetch the student's current group or pass it as a prop/route param
    // For now, let's assume authStore.user.id is the studentId and we need a groupId
    // This groupId should come from the context where the student is viewing the protocol
    // For demonstration, let's use a placeholder or assume it's available from route.params
    const groupId = route.query.groupId as string; // Assuming groupId is passed as a query parameter

    if (!groupId) {
      throw new Error("Group ID is missing. Cannot submit protocol.");
    }

    await submissionStore.createSubmission({
      groupId: groupId,
      protocolId: route.params.id as string,
      studentIds: [authStore.user?.id], // Assuming single student submission for now
      formData: formData.value,
    });
    snackbar.value = {
      show: true,
      text: "¡Protocolo enviado exitosamente!",
      color: "success",
      timeout: 3000,
    };
    router.back(); // Go back to the previous page
  } catch (error: any) {
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: "error",
      timeout: 3000,
    };
  }
};
</script>

<style scoped>
.v-card {
  background-color: #fff;
}
</style>
