<template>
  <v-container>
    <h2 class="mb-4">Detalles del Protocolo</h2>

    <v-card v-if="protocolStore.currentProtocol">
      <v-card-title>{{ protocolStore.currentProtocol.name }}</v-card-title>
      <v-card-subtitle>{{ protocolStore.currentProtocol.description }}</v-card-subtitle>
      <v-card-text>
        <p><strong>Tipo de Producto:</strong> {{ protocolStore.currentProtocol.productType }}</p>

        <h3 class="mt-4">Formularios Asociados</h3>
        <v-list>
          <v-list-item v-for="form in protocolStore.currentProtocol.forms" :key="form.id">
            <v-list-item-title>{{ form.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ form.description }}</v-list-item-subtitle>
            <template v-slot:append>
              <v-btn icon variant="text" @click="fillForm(form.id)">
                <v-icon>mdi-pencil</v-icon> <!-- Icon for filling form -->
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    <v-card v-else>
      <v-card-text>Cargando detalles del protocolo o protocolo no encontrado.</v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProtocolStore } from '~/stores/protocolStore'; // Assuming a protocolStore exists

const route = useRoute();
const router = useRouter();
const protocolStore = useProtocolStore(); // Initialize protocolStore

onMounted(async () => {
  const protocolId = route.params.protocolId as string;
  if (protocolId) {
    await protocolStore.fetchProtocol(protocolId);
  }
});

const fillForm = (formId: string) => {
  // This route needs to be defined later for filling a specific form
  console.log(`Navigate to fill form: ${formId} for protocol ${route.params.protocolId} in group ${route.params.groupId}`);
  // Example: router.push(`/fill-form/${route.params.groupId}/${formId}`);
};
</script>