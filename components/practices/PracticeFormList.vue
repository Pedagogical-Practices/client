<template>
  <v-card>
    <v-card-title class="text-h5 primary--text"
      >Protocolos de la Práctica</v-card-title
    >
    <v-card-text>
      <v-list lines="two">
        <v-list-item
          v-for="protocol in practice.protocols"
          :key="protocol.id"
          :title="protocol.name"
          :subtitle="getProtocolStatus(protocol.id).statusText"
        >
          <template v-slot:prepend>
            <v-icon :color="getProtocolStatus(protocol.id).color">{{
              getProtocolStatus(protocol.id).icon
            }}</v-icon>
          </template>
          <template v-slot:append>
            <v-btn
              v-if="!getProtocolStatus(protocol.id).isCompleted"
              color="primary"
              variant="flat"
              @click="fillForm(protocol.id)"
            >
              <v-icon left>mdi-file-edit-outline</v-icon>
              Llenar Formulario
            </v-btn>
            <div v-else-if="getProtocolStatus(protocol.id).isCompleted">
              <v-btn
                color="success"
                variant="outlined"
                @click="viewSubmission(getProtocolStatus(protocol.id).submissionId)"
              >
                <v-icon left>mdi-file-document-outline</v-icon>
                Ver Reporte
              </v-btn>
              <v-btn
                color="info"
                variant="text"
                @click="fillForm(protocol.id)"
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

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { useRouter } from "vue-router";
import { Practice } from "~/server/src/practice/schemas/practice.schema";
import { Submission } from "~/server/src/submission/schemas/submission.schema";

const props = defineProps<{
  practice: Practice;
}>();

const router = useRouter();

const getProtocolStatus = (protocolId: string) => {
  const submission = props.practice.submissions.find(
    (sub: Submission) => sub.protocol.id === protocolId
  );

  if (submission) {
    return {
      isCompleted: true,
      statusText: `Completado (${new Date(submission.createdAt).toLocaleDateString()})`,
      color: "green",
      icon: "mdi-check-circle",
      submissionId: submission.id,
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

const fillForm = (protocolId: string) => {
  router.push(`/fill-form/${props.practice.id}/${protocolId}`);
};

const viewSubmission = (submissionId: string) => {
  router.push(`/submissions/${submissionId}`);
};
</script>