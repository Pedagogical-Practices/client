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
          <!-- Usar <pre> para valores que son JSON formateado (fallback) -->
          <pre v-if="field.isObject">{{ field.value }}</pre>
          <span v-else>{{ field.value }}</span>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Form, FormField } from '~/types';
import { FormFieldType } from '~/types';

const props = defineProps<{
  formDefinition: Form | null;
  formData: Record<string, any> | null;
}>();

// Función auxiliar para dar formato a los valores según el tipo de campo
const formatDisplayValue = (field: FormField, value: any): { formattedValue: string; isObject: boolean } => {
  if (value === null || value === undefined || value === '' || (typeof value === 'object' && Object.keys(value).length === 0)) {
    return { formattedValue: 'Sin respuesta', isObject: false };
  }

  switch (field.type) {
    case FormFieldType.SELECT_DYNAMIC:
    case FormFieldType.SELECT_SIMPLE:
      if (value && typeof value === 'object' && value.hasOwnProperty('text')) {
        return { formattedValue: value.text, isObject: false };
      }
      break;

    case FormFieldType.DATE:
    case FormFieldType.DATE_PICKER:
    case FormFieldType.DATE_INPUT:
      if (typeof value === 'string') {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
          return { formattedValue: date.toLocaleDateString('es-ES', options), isObject: false };
        }
      }
      break;

    case FormFieldType.RADIO_GROUP:
      if (typeof value === 'object' && Object.keys(value).length > 0) {
        const selectedKey = Object.keys(value)[0];
        const selectedOption = (field.options as any[])?.find(opt => opt.value === selectedKey);
        if (selectedOption) {
          if (selectedOption.isOtherOption) {
            return { formattedValue: `${selectedOption.label}: ${value[selectedKey]}`, isObject: false };
          }
          return { formattedValue: selectedOption.label, isObject: false };
        }
      }
      break;

    case FormFieldType.CHECKBOX_GROUP:
      if (typeof value === 'object') {
        const selectedLabels = Object.keys(value).map(key => {
          const option = (field.options as any[])?.find(opt => opt.value === key);
          if (!option) return null;
          if (option.isOtherOption) {
            return value[key] ? `${option.label}: ${value[key]}` : null;
          }
          return value[key] ? option.label : null;
        }).filter(label => label !== null);
        if (selectedLabels.length > 0) {
          return { formattedValue: selectedLabels.join(', '), isObject: false };
        }
        return { formattedValue: 'Sin respuesta', isObject: false };
      }
      break;

    case FormFieldType.REPEATER:
      if (Array.isArray(value) && value.length > 0) {
        const itemLines = value.map((item, index) => {
          const itemDetails = Object.entries(item).map(([key, val]) => `${key}: ${val}`).join(', ');
          return `  - Registro ${index + 1}: { ${itemDetails} }`;
        });
        return { formattedValue: `\n${itemLines.join('\n')}`, isObject: true };
      }
      break;

    case FormFieldType.RADIOMATRIX:
      if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0) {
        const itemLines = Object.entries(value).map(([key, val]) => `  - ${key}: ${val}`);
        return { formattedValue: `\n${itemLines.join('\n')}`, isObject: true };
      }
      break;
  }

  // Fallback para otros objetos o valores no manejados
  if (typeof value === 'object') {
    return { formattedValue: JSON.stringify(value, null, 2), isObject: true };
  }

  return { formattedValue: value.toString(), isObject: false };
};

const processedFields = computed(() => {
  if (!props.formDefinition?.fields || !props.formData) {
    return [];
  }

  return props.formDefinition.fields
    .filter(field => field.type !== FormFieldType.TYPOGRAPHY_HEADING && field.type !== FormFieldType.TYPOGRAPHY_BODY)
    .map(field => {
      const rawValue = props.formData![field.name] ?? null;
      const { formattedValue, isObject } = formatDisplayValue(field, rawValue);
      return {
        label: field.label,
        value: formattedValue,
        isObject: isObject,
      };
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
