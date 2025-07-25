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
            Crear, editar y eliminar usuarios del sistema. Asignar roles y
            gestionar perfiles.
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Añadir más tarjetas aquí para otras secciones de administración -->
      <v-col cols="12" md="4">
        <v-card to="/admin/protocols" hover class="pa-2">
          <v-card-title>
            <v-icon left>mdi-file-document-multiple</v-icon>
            <span class="ml-2">Gestionar Protocolos</span>
          </v-card-title>
          <v-card-text>
            Definir y organizar los protocolos que contienen los formularios
            para las prácticas.
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card to="/courses" hover class="pa-2">
          <v-card-title>
            <v-icon left>mdi-book-open-page-variant</v-icon>
            <span class="ml-2">Gestionar Cursos</span>
          </v-card-title>
          <v-card-text>
            Crear, editar y eliminar cursos de práctica.
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card to="/forms" hover class="pa-2">
          <v-card-title>
            <v-icon left>mdi-form-select</v-icon>
            <span class="ml-2">Gestionar Formularios</span>
          </v-card-title>
          <v-card-text>
            Crear, editar y eliminar plantillas de formularios dinámicos.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Middleware de ruta para proteger el panel de administración
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
