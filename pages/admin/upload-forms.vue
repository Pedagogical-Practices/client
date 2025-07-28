<template>
  <div>
    <BulkFormUploader />
  </div>
</template>

<script setup lang="ts">
import BulkFormUploader from '~/components/forms/BulkFormUploader.vue';

definePageMeta({
  middleware: 'admin'
});
</script>
