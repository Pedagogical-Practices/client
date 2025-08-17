<template>
  <v-container fluid>
    <div v-if="!formDefinition || !formData">
      <p>Esperando datos del formulario...</p>
    </div>
    <div v-else>
      <div
        v-for="(field, index) in processedFields"
        :key="index"
        class="report-field"
      >
        <div class="field-label">{{ field.label }}</div>
        <div class="field-value">
          <!-- Si el valor es un objeto (ej. CheckboxGroup), lo mostramos como JSON formateado -->
          <pre v-if="typeof field.value === 'object' && field.value !== null">{{
            JSON.stringify(field.value, null, 2)
          }}</pre>
          <!-- De lo contrario, validamos si es formato fecha para convertirlo, de lo contrario mostramos el valor simple -->
          <span v-else>{{ field.value || "Sin respuesta" }}</span>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Form } from '~/types';

// 1. Definir las props que el componente espera recibir de la página contenedora.
const props = defineProps<{
  formDefinition: Form | null;
  formData: Record<string, any> | null;
}>();

// 2. Crear una propiedad computada para fusionar la plantilla y los datos.
const processedFields = computed(() => {
  if (!props.formDefinition?.fields || !props.formData) {
    return [];
  }

  // 3. Iterar sobre los campos de la plantilla (el "esqueleto").
  return props.formDefinition.fields.map(field => {
    let value = props.formData![field.name] ?? null;
    
    // --- Lógica para refinar la visualización de valores ---
    if (value && typeof value === 'object' && !Array.isArray(value) && value.hasOwnProperty('text')) {
      // Si el valor es un objeto de v-select, mostrar solo el texto.
      value = value.text;
    } else {
      // Lista de todos los posibles tipos de campo de fecha
      const dateTypes = ['DATE', 'DATE_PICKER', 'DATE_INPUT'];
      if (dateTypes.includes(field.type) && typeof value === 'string' && value) {
        // Si el campo es de tipo fecha y tiene un valor de texto, formatearlo.
        const date = new Date(value);
        if (!isNaN(date.getTime())) { // Asegurarse de que la fecha sea válida
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC', // Usar UTC para evitar errores de un día por zona horaria
          };
          value = date.toLocaleDateString('es-ES', options);
        }
      }
    }
    
    return {
      label: field.label,
      value: value,
      type: field.type,
    };
  }).filter(field => {
    // 4. Filtrar los campos que son puramente visuales y no contienen una respuesta.
    return field.type !== 'TYPOGRAPHY_HEADING' && field.type !== 'TYPOGRAPHY_BODY';
  });
});
</script>

<style scoped>
.report-field {
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.field-label {
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
  font-size: 0.9em;
  text-transform: uppercase;
}

.field-value {
  color: #555;
  font-size: 1em;
  white-space: pre-wrap; /* Respeta los saltos de línea en textareas */
  word-wrap: break-word;
}

.field-value pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
  font-size: inherit;
  margin: 0;
  padding: 0;
}
</style>
