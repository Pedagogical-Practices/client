<template>
  <v-container fluid>
    {{ formData }}
    <v-row v-for="(field, index) in formDefinition.fields" :key="field.name">
      <v-col cols="12">
        <div class="report-field">
          <div class="field-label">{{ field.label }}</div>
          <div class="field-value">
            <template
              v-if="
                field.type === FormFieldType.TEXT ||
                field.type === FormFieldType.TEXTAREA ||
                field.type === FormFieldType.NUMBER ||
                field.type === FormFieldType.EMAIL ||
                field.type === FormFieldType.PASSWORD
              "
            >
              {{ getFieldValue(field.name) || "N/A" }}
            </template>
            <template
              v-else-if="
                field.type === FormFieldType.DATE ||
                field.type === FormFieldType.DATE_PICKER
              "
            >
              {{ formatDate(getFieldValue(field.name)) || "N/A" }}
            </template>
            <template v-else-if="field.type === FormFieldType.SELECT_SIMPLE">
              {{ getSelectSimpleValue(field) || "N/A" }}
            </template>
            <template v-else-if="field.type === FormFieldType.SELECT_DYNAMIC">
              {{ getSelectDynamicValue(field) || "N/A" }}
            </template>
            <template v-else-if="field.type === FormFieldType.CHECKBOX">
              {{ getFieldValue(field.name) ? "Sí" : "No" }}
            </template>
            <template
              v-else-if="
                field.type === FormFieldType.CHECKBOX_GROUP ||
                field.type === FormFieldType.RADIO_GROUP
              "
            >
              <div v-if="getFieldValue(field.name)">
                <v-chip
                  v-for="(value, key) in getFieldValue(field.name)"
                  :key="key"
                  size="small"
                  class="ma-1"
                >
                  {{ key }}: {{ value ? "Sí" : "No" }}
                </v-chip>
              </div>
              <span v-else>N/A</span>
            </template>
            <template v-else-if="field.type === FormFieldType.MAP">
              {{ getFieldValue(field.name) || "N/A" }}
              <v-btn
                v-if="getFieldValue(field.name)"
                icon="mdi-map-marker-radius"
                size="small"
                variant="text"
                :href="`https://www.google.com/maps/search/?api=1&query=${getFieldValue(field.name)}`"
                target="_blank"
              >
              </v-btn>
            </template>
            <template
              v-else-if="
                field.type === FormFieldType.TYPOGRAPHY_HEADING ||
                field.type === FormFieldType.TYPOGRAPHY_BODY
              "
            >
              <component
                :is="field.tag || 'p'"
                :style="getTypographyStyle(field)"
                >{{ field.text }}</component
              >
            </template>
            <template v-else>
              {{ getFieldValue(field.name) || "N/A" }}
            </template>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { FormFieldType, type FormField, DataSourceType } from "~/types";
import { useDataSourceStore } from "~/stores/dataSourceStore";

export interface Form {
  id?: string;
  name: string;
  description?: string;
  fields: FormField[];
}

const props = defineProps<{
  formDefinition: Form;
  formData: Record<string, any>;
}>();

const dataSourceStore = useDataSourceStore();
const dynamicSelectValues = ref<Record<string, string>>({});

// Function to get the value for a given field name from formData
const getFieldValue = (fieldName: string) => {
  return props.formData ? props.formData[fieldName] : null;
};

// Function to format date values
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return dateString; // Return original if invalid date
  }
};

// Function to get the display value for SELECT_SIMPLE
const getSelectSimpleValue = (field: FormField) => {
  const value = getFieldValue(field.name);
  if (!value) return null;
  // Assuming field.options is an array of { label, value } or just strings
  if (Array.isArray(field.options)) {
    const selectedOption = field.options.find((option: any) => {
      if (typeof option === "object" && option !== null && "value" in option) {
        return option.value === value;
      }
      return option === value;
    });
    return selectedOption ? selectedOption.label || selectedOption : value;
  } else if (field.options && field.options.items) {
    // For options with items array
    const selectedOption = field.options.items.find((option: any) => {
      if (typeof option === "object" && option !== null && "value" in option) {
        return option.value === value;
      }
      return option === value;
    });
    return selectedOption ? selectedOption.label || selectedOption : value;
  }
  return value;
};

// Function to get the display value for SELECT_DYNAMIC
const getSelectDynamicValue = (field: FormField) => {
  const id = getFieldValue(field.name);
  if (!id) return null;
  return dynamicSelectValues.value[id] || "Cargando...";
};

// Function to get typography styles
const getTypographyStyle = (field: FormField) => {
  const style: Record<string, string> = {};
  if (field.fontWeight) style.fontWeight = field.fontWeight;
  if (field.textAlign) style.textAlign = field.textAlign;
  if (field.textDecoration) style.textDecoration = field.textDecoration;
  if (field.textTransform) style.textTransform = field.textTransform;
  if (field.color) style.color = field.color;
  return style;
};

// Watch formData to fetch dynamic select values
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
}

.field-value {
  color: #555;
  font-size: 0.95em;
}

.field-value .v-btn {
  margin-left: 8px;
}
</style>
