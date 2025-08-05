<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Detalle del Grupo</span>
            <v-btn
              color="primary"
              prepend-icon="mdi-arrow-left"
              @click="router.back()"
            >
              Volver
            </v-btn>
          </v-card-title>
          <v-card-text v-if="groupStore.currentGroup">
            <v-row>
              <v-col cols="12" md="6">
                <v-list-item>
                  <v-list-item-title>Estudiante:</v-list-item-title>
                  <v-list-item-subtitle>{{ groupStore.currentGroup.student?.name || 'N/A' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Docente Asesor:</v-list-item-title>
                  <v-list-item-subtitle>{{ groupStore.currentGroup.teacher?.name || 'N/A' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Curso:</v-list-item-title>
                  <v-list-item-subtitle>{{ groupStore.currentGroup.practice?.name || 'N/A' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Estado:</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip
                      v-if="groupStore.currentGroup?.status"
                      :color="getStatusColor(groupStore.currentGroup.status)"
                      size="small"
                    >
                      {{ groupStore.currentGroup.status }}
                    </v-chip>
                    <span v-else>N/A</span>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-col>
              <v-col cols="12" md="6">
                <v-list-item>
                  <v-list-item-title>Protocolos:</v-list-item-title>
                  <v-list-item-subtitle>
                    <div v-if="groupStore.currentGroup.protocols && groupStore.currentGroup.protocols.length > 0">
                      <v-chip
                        v-for="protocol in groupStore.currentGroup.protocols"
                        :key="protocol.id"
                        size="small"
                        class="mr-1 mb-1"
                      >
                        {{ protocol.name }}
                      </v-chip>
                    </div>
                    <span v-else>N/A</span>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Creado por:</v-list-item-title>
                  <v-list-item-subtitle>{{ groupStore.currentGroup.createdBy?.name || 'N/A' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Fecha de Creación:</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ groupStore.currentGroup.createdAt ? new Date(groupStore.currentGroup.createdAt).toLocaleDateString() : 'N/A' }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Progreso:</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-progress-linear
                      :model-value="completionPercentage"
                      color="primary"
                      height="10"
                      rounded
                    >
                      <strong>{{ completionPercentage.toFixed(0) }}%</strong>
                    </v-progress-linear>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <h3 class="mb-3">Formularios del Protocolo</h3>
            <v-list density="compact">
              <v-list-item
                v-for="protocol in groupStore.currentPractice.protocols"
                :key="protocol.id"
              >
                <template v-slot:prepend>
                  <v-icon
                    :color="getProtocolStatus(protocol.id).color"
                    :icon="getProtocolStatus(protocol.id).icon"
                  ></v-icon>
                </template>
                <v-list-item-title>
                  {{ protocol.name || 'Formulario Desconocido' }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  Estado: {{ getProtocolStatus(protocol.id).statusText }}
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn
                    v-if="!getProtocolStatus(protocol.id).isCompleted"
                    color="success"
                    size="small"
                    class="mr-2"
                    @click="fillForm(protocol.id)"
                  >
                    Llenar Formulario
                  </v-btn>
                  <v-btn
                    v-else
                    color="info"
                    size="small"
                    @click="viewSubmission(getProtocolStatus(protocol.id).submissionId)"
                  >
                    Ver Envío
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-text v-else>
            <v-alert type="info">Cargando detalles del grupo o grupo no encontrado.</v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGroupStore } from '~/stores/groupStore';
import { PracticeStatus } from '~/types';

definePageMeta({});

const route = useRoute();
const router = useRouter();
const groupStore = useGroupStore();

const groupId = route.params.id as string;

onMounted(async () => {
  if (groupId) {
    await groupStore.fetchGroup(groupId);
    console.log("groupStore.currentGroup after fetch:", groupStore.currentGroup);
  }
});

const getProtocolStatus = (protocolId: string) => {
  const submission = groupStore.currentPractice?.submissions.find(
    (sub: any) => sub.protocol.id === protocolId
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

const completionPercentage = computed(() => {
  if (!groupStore.currentGroup || !groupStore.currentGroup.protocols) {
    return 0;
  }
  const totalProtocols = groupStore.currentGroup.protocols.length;
  if (totalProtocols === 0) {
    return 0;
  }
  const completedProtocols = groupStore.currentGroup.protocols.filter(
    (protocol: any) => getProtocolStatus(protocol.id).isCompleted
  ).length;
  return (completedProtocols / totalProtocols) * 100;
});

const getStatusColor = (status: PracticeStatus): string => {
  switch (status) {
    case PracticeStatus.PENDING:
      return 'blue';
    case PracticeStatus.IN_PROGRESS:
      return 'orange';
    case PracticeStatus.COMPLETED:
      return 'green';
    case PracticeStatus.ARCHIVED:
      return 'grey';
    default:
      return 'grey';
  }
};

const fillForm = (protocolId: string) => {
  router.push(`/forms/fill/${protocolId}?groupId=${groupId.value}`);
};

const viewSubmission = (submissionId: string) => {
  router.push(`/submissions/${submissionId}`);
};

const evaluateSubmission = (submissionId: string) => {
  router.push(`/evaluate-submission/${submissionId}`);
};
</script>

<style scoped>
.v-card {
  background-color: #fff;
  border-radius: 8px;
}
</style>