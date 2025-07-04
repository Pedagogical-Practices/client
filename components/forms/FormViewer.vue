<template>
  <div v-if="fields.length === 0" class="empty-message">
    No hay campos en este formulario.
  </div>
  <div v-else class="fields-list">
    <v-row
      v-for="field in fields"
      :key="field.variableName || field.label"
      class="field-item"
    >
      <v-col cols="12">
        <component
          :is="getComponentName(field.type)"
          :model-value="
            field.type === 'checkbox' ? field.value === 'true' : field.value
          "
          @update:model-value="(val: any) => updateFieldValue(field, val)"
          :label="field.label"
          :placeholder="field.placeholder"
          :hint="field.hint"
          :persistent-hint="true"
          :required="field.required"
          :disabled="field.disabled"
          :readonly="field.readonly"
          :options="field.options"
          :specific-type="field.specificType"
          :height="field.height"
          :color="field.color"
          :rules="field.required ? [(v: any) => !!v || 'Requerido'] : []"
          class="field-component"
          variant="outlined"
        />
        <v-divider class="my-2" v-if="field !== fields[fields.length - 1]" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  VTextField,
  VTextarea,
  VCheckbox,
  VSelect,
  VBtn,
  VRadioGroup,
  VDatePicker,
} from "vuetify/components";
import type { FormElement } from "~/stores/formElementStore";

const props = defineProps<{
  fields: FormElement[];
}>();

const emit = defineEmits<{
  (e: "update:fields", fields: FormElement[]): void;
}>();

const componentMap: Record<string, any> = {
  text: VTextField,
  textarea: VTextarea,
  checkbox: VCheckbox,
  select: VSelect,
  button: VBtn,
  "radio-group": VRadioGroup,
  "date-picker": VDatePicker,
};

const getComponentName = (type: string) => {
  return componentMap[type] || VTextField;
};

const updateFieldValue = (field: FormElement, newValue: any) => {
  const updatedFields = props.fields.map((f) =>
    f === field
      ? { ...f, value: field.type === "checkbox" ? String(newValue) : newValue }
      : f
  );
  emit("update:fields", updatedFields);
};
</script>

<style scoped>
.empty-message {
  text-align: center;
  color: #757575;
  font-style: italic;
  padding: 16px;
}
.fields-list {
  margin-top: 8px;
}
.field-item {
  margin-bottom: 8px;
}
.field-component {
  max-width: 600px;
}
</style>
