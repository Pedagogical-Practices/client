<!-- components/protocols/AttendanceList.vue -->
<template>
  <v-data-table
    :headers="headers"
    :items="attendanceRecords"
    :items-per-page="10"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Registros de Asistencia</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="$emit('add')" prepend-icon="mdi-plus">
          Añadir Registro
        </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn color="primary" variant="text" @click="$emit('view', item)">
        Ver
      </v-btn>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
defineProps<{
  attendanceRecords: any[];
}>();

defineEmits(["add", "view"]);

const headers = [
  { title: "Semana", key: "week" },
  { title: "Fecha", key: "date" },
  { title: "Tema / Actividad", key: "topic" },
  { title: "No. de horas", key: "hours" },
  { title: "Grupo", key: "group" },
  { title: "Clase", key: "classType" },
  { title: "Otra", key: "other" },
  { title: "Firma Asesor", key: "advisorSignature" },
  { title: "Firma Tutor", key: "tutorSignature" },
  { title: "Observaciones", key: "observations" },
  { title: "Acciones", key: "actions", sortable: false },
];
</script>
