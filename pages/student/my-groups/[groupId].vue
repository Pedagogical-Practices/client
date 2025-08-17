<template>
  <v-container>
    <v-row v-if="groupStore.isLoading || submissionStore.isLoading">
      <v-col class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
        <p>Cargando datos de la práctica...</p>
      </v-col>
    </v-row>
    <v-row v-else-if="groupStore.error">
      <v-col>
        <v-alert type="error" dismissible>
          Error al cargar los datos del grupo: {{ groupStore.error.message }}
        </v-alert>
      </v-col>
    </v-row>
    <v-row v-else-if="group">
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5">{{ group.practice.name }}</v-card-title>
          <v-card-subtitle
            >{{ group.name }} - Periodo: {{ group.period }}</v-card-subtitle
          >
          <v-card-text>
            <p>
              <strong>Tutor:</strong> {{ group.tutor.firstName }}
              {{ group.tutor.lastName }}
            </p>
            <p>
              <strong>Instituciones:</strong>
              {{ group.institutions.map((i) => i.name).join(", ") }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <h2 class="text-h6 my-4">Progreso de Protocolos</h2>
        <StudentProtocolProgress
          :protocols="group.practice.protocols"
          :submissions="submissions"
          :deadlines="group.deadlines || []"
          :group-id="groupId"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useGroupStore } from "~/stores/groupStore";
import { useSubmissionStore } from "~/stores/submissionStore";
import StudentProtocolProgress from "~/components/student/StudentProtocolProgress.vue";

definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const groupStore = useGroupStore();
const submissionStore = useSubmissionStore();

const groupId = route.params.groupId;

const group = computed(() => groupStore.currentGroup);
const submissions = computed(() => submissionStore.groupSubmissions);

onMounted(async () => {
  if (groupId) {
    // Fetch both group details (including deadlines) and submission history in parallel
    await Promise.all([
      groupStore.fetchGroup(groupId),
      submissionStore.fetchSubmissionsByGroup(groupId),
    ]);
  }
});
</script>
