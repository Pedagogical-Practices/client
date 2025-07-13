<template>
  <v-container v-if="practiceStore.currentPractice">
    <v-row>
      <v-col cols="12">
        <PracticeDetailHeader :practice="practiceStore.currentPractice" />
      </v-col>
      <v-col cols="12">
        <PracticeProgress :practice="practiceStore.currentPractice" />
      </v-col>
      <v-col cols="12">
        <PracticeFormList :practice="practiceStore.currentPractice" />
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-row>
      <v-col cols="12">
        <p>Cargando detalles de la práctica...</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({
  middleware: ['redirect-admin-from-practices'],
});
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePracticeStore } from '~/stores/practiceStore';
import PracticeDetailHeader from '~/components/practices/PracticeDetailHeader.vue';
import PracticeProgress from '~/components/practices/PracticeProgress.vue';
import PracticeFormList from '~/components/practices/PracticeFormList.vue';

console.log("practices/[id].vue: Script setup started.");

const route = useRoute();
const practiceStore = usePracticeStore();

onMounted(async () => {
  const practiceId = route.params.id;
  console.log("practices/[id].vue: onMounted - practiceId:", practiceId);
  if (practiceId) {
    try {
      await practiceStore.fetchPractice(practiceId);
      console.log("practices/[id].vue: Practice fetched:", practiceStore.currentPractice);
    } catch (error) {
      console.error("practices/[id].vue: Error fetching practice details:", error);
    }
  }
});
</script>
