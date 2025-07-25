<template>
  <v-container v-if="practiceStore.currentPractice">
    <v-col cols="12">
      <PracticeDetailHeader :practice="practiceStore.currentPractice" />
    </v-col>
    <v-col cols="12">
      <PracticeProgress :practice="practiceStore.currentPractice" />
    </v-col>
    <v-col cols="12">
      <PracticeFormList
        :practice="practiceStore.currentPractice"
      />
    </v-col>
  </v-container>
  <v-container v-else>
    <v-row>
      <v-col cols="12">
        <p>Cargando detalles de la práctica...</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { usePracticeStore } from "~/stores/practiceStore";
import { useAuthStore } from "~/stores/authStore";
import PracticeDetailHeader from "~/components/practices/PracticeDetailHeader.vue";
import PracticeProgress from "~/components/practices/PracticeProgress.vue";
import PracticeFormList from "~/components/practices/PracticeFormList.vue";

const route = useRoute();
const practiceStore = usePracticeStore();
const authStore = useAuthStore();

onMounted(async () => {
  const practiceId = route.params.id as string;
  if (practiceId) {
    try {
      await practiceStore.fetchPractice(practiceId);
    } catch (error) {
      console.error(
        "practices/[id].vue: Error fetching practice details:",
        error
      );
    }
  }
});
</script>
