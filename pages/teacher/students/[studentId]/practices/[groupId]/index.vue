<template>
  <v-container>
    <h2 class="mb-4">Detalles del Grupo</h2>

    <v-card v-if="groupStore.currentGroup">
      <v-card-title>{{ groupStore.currentGroup.name }}</v-card-title>
      <v-card-subtitle>
        Periodo: {{ groupStore.currentGroup.period }}
      </v-card-subtitle>
      <v-card-text>
        <p><strong>Práctica Curricular:</strong> {{ groupStore.currentGroup.practice?.name }}</p>
        <p><strong>Tutor:</strong> {{ groupStore.currentGroup.tutor?.firstName }} {{ groupStore.currentGroup.tutor?.lastName }}</p>
        <p><strong>Estudiantes:</strong>
          <span v-for="(student, index) in groupStore.currentGroup.students" :key="student.id">
            {{ student.firstName }} {{ student.lastName }}{{ index < groupStore.currentGroup.students.length - 1 ? ', ' : '' }}
          </span>
        </p>
        <p><strong>Instituciones:</strong>
          <span v-for="(institution, index) in groupStore.currentGroup.institutions" :key="institution.id">
            {{ institution.name }}{{ index < groupStore.currentGroup.institutions.length - 1 ? ', ' : '' }}
          </span>
        </p>

        <h3 class="mt-4">Protocolos del Grupo</h3>
        <v-list>
          <v-list-item v-for="protocol in groupStore.currentGroup.practice?.protocols" :key="protocol.id">
            <v-list-item-title>{{ protocol.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ protocol.description }}</v-list-item-subtitle>
            <template v-slot:append>
              <v-btn icon variant="text" @click="viewProtocolForms(protocol.id)">
                <v-icon>mdi-arrow-right</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>

      </v-card-text>
    </v-card>
    <v-card v-else>
      <v-card-text>Cargando detalles del grupo o grupo no encontrado.</v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGroupStore } from '~/stores/groupStore';

const route = useRoute();
const router = useRouter();
const groupStore = useGroupStore();

onMounted(async () => {
  const groupId = route.params.groupId as string;
  console.log("Fetching group details for groupId:", groupId); // ADD THIS LOG
  if (groupId) {
    await groupStore.fetchGroup(groupId);
    console.log("Group details fetched:", groupStore.currentGroup); // ADD THIS LOG
  }
});

const viewProtocolForms = (protocolId: string) => {
  router.push(`/teacher/students/${route.params.studentId}/practices/${route.params.groupId}/protocols/${protocolId}`);
};
</script>