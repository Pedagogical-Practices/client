<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center">
      <span>Fechas Importantes</span>
      <v-btn icon="mdi-refresh" @click="fetchImportantDates"></v-btn>
    </v-card-title>
    <v-card-text>
      <v-row class="fill-height">
        <v-col cols="12" md="9">
          <v-sheet>
            <v-calendar :events="formattedEvents" color="primary"></v-calendar>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="3">
          <v-list density="compact" class="mt-4">
            <v-list-item
              v-for="event in calendarEvents"
              :key="event.title"
              :title="event.title"
              :subtitle="event.start"
            >
              <template v-slot:append>
                <v-chip :color="getSemaphoreColor(event.status)" size="small">{{
                  event.status
                }}</v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  status: "verde" | "amarillo" | "rojo";
}

const getSemaphoreColor = (status: "verde" | "amarillo" | "rojo"): string => {
  switch (status) {
    case "verde":
      return "green";
    case "amarillo":
      return "orange";
    case "rojo":
      return "red";
    default:
      return "grey";
  }
};

const calendarEvents = ref<CalendarEvent[]>([
  // Datos de ejemplo
  {
    title: "Entrega de Informe PPI1",
    start: "2025-07-15",
    end: "2025-07-15",
    status: "amarillo",
  },
  {
    title: "Reunión de Asesores",
    start: "2025-07-20",
    end: "2025-07-20",
    status: "verde",
  },
  {
    title: "Formulario Vencido",
    start: "2025-06-25",
    end: "2025-06-25",
    status: "rojo",
  },
]);

const formattedEvents = computed(() =>
  calendarEvents.value.map((event) => ({
    title: event.title,
    start: new Date(`${event.start}T00:00:00`),
    end: new Date(`${event.end}T00:00:00`),
    color: getSemaphoreColor(event.status),
  }))
);

const fetchImportantDates = () => {
  // Aquí se implementaría la lógica para obtener fechas importantes del backend
  console.log("Fetching important dates...");
};

onMounted(() => {
  fetchImportantDates();
});
</script>

<style scoped>
/* Estilos específicos para el calendario */
</style>
