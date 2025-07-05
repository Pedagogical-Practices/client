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
            <!--FormViewer
              v-if="formBuilderStore.currentForm"
              :form="formBuilderStore.currentForm"
              v-model="submissionData"
            /-->
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
// import { useFormBuilderStore } from "~/stores/formBuilderStore";
import { useFormStore } from "~/stores/formStores";
import { useProtocolStore } from "~/stores/protocolStore";
import { useSubmissionStore } from "~/stores/submissionStore";

definePageMeta({});

const route = useRoute();
const router = useRouter();
// const formBuilderStore = useFormBuilderStore();

const formStore = useFormStore();
const protocolStore = useProtocolStore();
const submissionStore = useSubmissionStore();
const submissionData = ref({});
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

onMounted(async () => {
  const protocolId = route.params.id as string;
  await protocolStore.fetchProtocol(protocolId);
  if (protocolStore.currentProtocol?.formId) {
    await formStore.fetchForm(protocolStore.currentProtocol.formId);
  }
});

const submitProtocol = async () => {
  try {
    await submissionStore.submitProtocol({
      protocolId: route.params.id as string,
      formId: protocolStore.currentProtocol?.formId || "",
      data: submissionData.value,
    });
    snackbar.value = {
      show: true,
      text: "¡Protocolo enviado exitosamente!",
      color: "success",
      timeout: 3000,
    };
    router.push(`/courses/${protocolStore.currentProtocol?.courseId}`);
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
