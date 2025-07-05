<template>
  <div>
    <div v-if="loading">Cargando...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <Editor v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useFormStore } from '~/stores/formStores';
import Editor from '~/pages/editor.vue';

definePageMeta({});

const route = useRoute();
const formStore = useFormStore();
const loading = ref(true);
const error = ref<Error | null>(null);

onMounted(async () => {
  try {
    const formId = route.params.id as string;
    await formStore.fetchFormById(formId);
  } catch (e) {
    error.value = e as Error;
  } finally {
    loading.value = false;
  }
});
</script>
