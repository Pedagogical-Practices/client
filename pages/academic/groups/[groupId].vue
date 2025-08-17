<template>
  <v-container fluid>
    <div v-if="loading">
      <v-skeleton-loader type="card, article"></v-skeleton-loader>
    </div>
    <div v-else-if="error">
      <v-alert type="error" :text="error"></v-alert>
    </div>
    <v-row v-else-if="group">
      <!-- Columna de Información General -->
      <v-col cols="12" md="4">
        <v-card class="mb-4">
          <v-card-title>Detalles del Grupo</v-card-title>
          <v-divider></v-divider>
          <v-list density="compact">
            <v-list-item title="Nombre" :subtitle="group.name"></v-list-item>
            <v-list-item title="Periodo" :subtitle="group.period"></v-list-item>
            <v-list-item v-if="group.practice" title="Práctica (Curso)" :subtitle="group.practice.name"></v-list-item>
            <v-list-item v-if="group.tutor" title="Tutor Asignado" :subtitle="`${group.tutor.firstName} ${group.tutor.lastName}`"></v-list-item>
          </v-list>
        </v-card>

        
      </v-col>

      <!-- Columna de Protocolos y Progreso con Pestañas -->
      <v-col cols="12" md="8">
        <v-card>
          <v-tabs v-model="tab" bg-color="primary">
            <v-tab value="general">Progreso General</v-tab>
            <v-tab value="student">Seguimiento por Estudiante</v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="general">
                <AcademicProtocolProgress
                  v-if="group.practice?.protocols"
                  :protocols="group.practice.protocols"
                  :submissions="submissions"
                  :deadlines="group.deadlines || []"
                  :total-students="group.students.length"
                  :group-id="groupId"
                />
                <p v-else>No hay protocolos asociados a la práctica de este grupo.</p>
              </v-window-item>

              <v-window-item value="student">
                <v-expansion-panels variant="accordion">
                  <v-expansion-panel v-for="student in group.students" :key="student.id">
                    <v-expansion-panel-title>
                      <v-icon start>mdi-account</v-icon>
                      {{ student.firstName }} {{ student.lastName }}
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <TutorStudentProgress
                        :protocols="group.practice.protocols"
                        :submissions="getSubmissionsForStudent(student.id)"
                      />
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useGroupStore } from '~/stores/groupStore';
import { useSubmissionStore } from '~/stores/submissionStore';
import AcademicProtocolProgress from '~/components/academic/AcademicProtocolProgress.vue';
import TutorStudentProgress from '~/components/academic/TutorStudentProgress.vue';

definePageMeta({
  middleware: 'academic'
});

const route = useRoute();
const groupStore = useGroupStore();
const submissionStore = useSubmissionStore();

const loading = ref(true);
const error = ref<string | null>(null);
const submissions = ref([]);
const tab = ref('general');

const groupId = route.params.groupId as string;

const group = computed(() => groupStore.currentGroup);

onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    await groupStore.fetchGroup(groupId);
    
    if (groupStore.currentGroup) {
      await submissionStore.fetchSubmissionsByGroup(groupId);
      submissions.value = submissionStore.groupSubmissions;
      console.log('Submissions fetched in group detail page:', submissions.value);
    } else {
      throw new Error("El grupo no fue encontrado o no se pudo cargar.");
    }
  } catch (e: any) { 
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});

const getSubmissionsForStudent = (studentId: string) => {
  return submissions.value.filter(sub => 
    sub.students.some((s: any) => s.id === studentId)
  );
};

useHead({
  title: computed(() => group.value ? `Grupo: ${group.value.name}` : 'Cargando Grupo...')
});
</script>
