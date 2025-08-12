<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h4">Mis Grupos de Práctica</h1>
        <p class="text-subtitle-1">Aquí puedes ver todos los grupos en los que estás inscrito.</p>
      </v-col>
    </v-row>

    <v-row v-if="groupStore.isLoading">
      <v-col class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p>Cargando tus grupos...</p>
      </v-col>
    </v-row>

    <v-row v-else-if="groupStore.error">
      <v-col>
        <v-alert type="error" dismissible>
          Error al cargar los grupos: {{ groupStore.error.message }}
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else-if="groups.length === 0">
      <v-col>
        <v-alert type="info">
          Actualmente no estás inscrito en ningún grupo de práctica.
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="group in groups" :key="group.id" cols="12" md="6" lg="4">
        <v-card class="mx-auto" max-width="400">
          <v-img
            class="align-end text-white"
            height="200"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
            cover
          >
            <v-card-title>{{ group.practice.name }}</v-card-title>
          </v-img>

          <v-card-subtitle class="pt-4">
            Periodo: {{ group.period }}
          </v-card-subtitle>

          <v-card-text>
            <div><strong>Grupo:</strong> {{ group.name }}</div>
            <div><strong>Tutor:</strong> {{ group.tutor.firstName }} {{ group.tutor.lastName }}</div>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="elevated" @click="viewGroupProgress(group.id)">
              Ver Progreso
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useGroupStore } from '~/stores/groupStore';
import { useRouter } from 'vue-router';

definePageMeta({
  middleware: 'auth',
});

const groupStore = useGroupStore();
const router = useRouter();

// Use a computed property to safely access the groups array
const groups = computed(() => groupStore.groups || []);

onMounted(async () => {
  await groupStore.fetchMyGroups();
});

const viewGroupProgress = (groupId) => {
  router.push(`/student/my-groups/${groupId}`);
};
</script>

<style scoped>
.v-card {
  transition: box-shadow 0.3s ease-in-out;
}
.v-card:hover {
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
}
</style>
