<template>
  <v-container fluid>
    <v-row v-for="(field, index) in formDefinition.fields" :key="index">
      <v-col cols="12">
        <component
          :is="getComponentName(field.type)"
          v-model="localFormData[field.variableName]"
          :label="field.label"
          :placeholder="field.placeholder"
          :hint="field.hint"
          :persistent-hint="true"
          :required="field.required"
          :disabled="field.disabled"
          :readonly="field.readonly"
          :items="field.options"
          item-title="label"
          item-value="value"
          :multiple="field.multiple"
          :rows="field.height ? Number(field.height) : undefined"
          :rules="field.required ? [(v) => !!v || 'Requerido'] : []"
          variant="outlined"
          density="compact"
        >
          <template v-if="field.type === 'radio-group'">
            <v-radio
              v-for="(option, i) in field.options"
              :key="i"
              :label="option.label"
              :value="option.value"
            ></v-radio>
          </template>
        </component>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import {
  VTextField,
  VTextarea,
  VCheckbox,
  VSelect,
  VRadioGroup,
  VRadio,
  VDatePicker,
} from 'vuetify/components';
import type { Form } from '~/types/form'; // Importar el tipo Form

const props = defineProps<{
  formDefinition: Form;
  modelValue: Record<string, any>; // Usar modelValue para v-model
}>();

const emit = defineEmits(['update:modelValue']);

const localFormData = ref<Record<string, any>>({});

// Inicializar localFormData cuando formDefinition o modelValue cambien
watch(() => props.formDefinition, (newVal) => {
  if (newVal?.fields) {
    localFormData.value = newVal.fields.reduce((acc, field) => {
      if (field.variableName) {
        acc[field.variableName] = props.modelValue[field.variableName] !== undefined
          ? props.modelValue[field.variableName]
          : (field.value !== undefined ? field.value : '');
      }
      return acc;
    }, {});
  }
}, { immediate: true, deep: true });

watch(localFormData, (newVal) => {
  emit('update:modelValue', newVal);
}, { deep: true });

const componentMap: Record<string, any> = {
  text: VTextField,
  textarea: VTextarea,
  checkbox: VCheckbox,
  select: VSelect,
  'radio-group': VRadioGroup,
  'date-picker': VDatePicker,
  // 'time-picker': VTextField, // Necesitará un componente específico o un VTextField con formato
};

const getComponentName = (type: string): any => {
  return componentMap[type] || VTextField;
};
</script>