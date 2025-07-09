<template>
  <v-container>
    <h1 class="text-h4 mb-4">Panel de Administración</h1>
    <v-row>
      <!-- Tarjeta para Gestionar Usuarios -->
      <v-col cols="12" md="4">
        <v-card to="/admin/users" hover class="pa-2">
          <v-card-title>
            <v-icon left>mdi-account-group</v-icon>
            <span class="ml-2">Gestionar Usuarios</span>
          </v-card-title>
          <v-card-text>
            Crear, editar y eliminar usuarios del sistema. Asignar roles y gestionar perfiles.
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Tarjeta para Gestionar Instituciones -->
      <v-col cols="12" md="4">
        <v-card to="/admin/institutions" hover class="pa-2">
          <v-card-title>
            <v-icon left>mdi-bank</v-icon>
            <span class="ml-2">Gestionar Instituciones</span>
          </v-card-title>
          <v-card-text>
            Añadir o editar las instituciones educativas asociadas a las prácticas pedagógicas.
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Añadir más tarjetas aquí para otras secciones de administración -->

    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Middleware de ruta para proteger el panel de administración
definePageMeta({
  middleware: 'admin'
});
</script>

<style scoped>
.v-card {
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
}
.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
</style>