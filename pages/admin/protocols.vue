<template>
  <v-container>
    <h1 class="text-h4 mb-4">Protocolos Disponibles</h1>
    <v-row>
      <v-col v-if="store.loading" cols="12">
        <v-progress-linear indeterminate></v-progress-linear>
      </v-col>
      <v-col v-else-if="store.protocols.length === 0" cols="12">
        <v-alert type="info"
          >No hay protocolos disponibles en este momento.</v-alert
        >
      </v-col>
      <v-col v-for="protocol in store.protocols" :key="protocol.id" cols="12">
        <v-card class="mb-4" hover height="300">
          <v-card-title>{{ protocol.name }}</v-card-title>
          <v-card-subtitle v-if="protocol.productType"
            >Tipo de Producto: {{ protocol.productType }}</v-card-subtitle
          >
          <v-card-text>
            <p v-if="protocol.description">{{ protocol.description }}</p>
            <div v-if="protocol.form" class="mt-4">
              <strong>Formulario asociado:</strong>
              <v-list
                density="compact"
                class="bg-transparent"
                style="max-height: 150px; overflow-y: auto"
              >
                <v-list-item :key="protocol.form.id" density="compact">
                  <template v-slot:prepend>
                    <v-icon>mdi-file-document-outline</v-icon>
                  </template>
                  <v-list-item-title>{{
                    protocol.form.name
                  }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useProtocolStore } from "~/stores/protocolStore";

const store = useProtocolStore();

onMounted(() => {
  store.fetchProtocols();
});
</script>

<style scoped>
.v-card {
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
}
.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
</style>
