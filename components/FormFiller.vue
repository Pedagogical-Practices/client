<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5">{{ formDefinition.name }}</v-card-title>
    <v-card-text>
      <v-form ref="formRef">
        <div v-for="field in formDefinition.fields" :key="field.variableName">
          <component
            :is="getComponentName(field)"
            v-model="formData[field.variableName]"
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
            :rules="field.required ? [(v: any) => !!v || 'Campo requerido'] : []"
            :multiple="field.multiple"
            :dataSource="field.dataSource"
            class="mb-4"
            variant="outlined"
          />
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="submitForm">{{ submissionId ? 'Actualizar' : 'Enviar' }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import {
  VTextField,
  VTextarea,
  VCheckbox,
  VSelect,
  VBtn,
  VRadioGroup,
  VDatePicker,
} from "vuetify/components";
import DynamicSelect from "~/components/forms/DynamicSelect.vue";

const props = defineProps<{
  formDefinition: any;
  initialData?: Record<string, any>;
  submissionId?: string | null;
}>();

const emit = defineEmits(['submit', 'update']);

const formRef = ref<HTMLFormElement | null>(null);
const formData = reactive<Record<string, any>>({});

const componentMap: Record<string, any> = {
  text: VTextField,
  textarea: VTextarea,
  checkbox: VCheckbox,
  select: VSelect,
  button: VBtn,
  "radio-group": VRadioGroup,
  "date-picker": VDatePicker,
};

const getComponentName = (field: any): any => {
  if (field.type === "select" && field.dataSource) {
    return DynamicSelect;
  }
  return componentMap[field.type] || VTextField;
};

const initializeForm = () => {
  const data = props.initialData || {};
  props.formDefinition.fields.forEach((field: any) => {
    formData[field.variableName] = data[field.variableName] !== undefined ? data[field.variableName] : (field.value !== undefined ? field.value : null);
    if (field.type === 'checkbox') {
      formData[field.variableName] = data[field.variableName] || field.value || false;
    } else if (field.type === 'select' && field.multiple) {
      formData[field.variableName] = data[field.variableName] || field.value || [];
    }
  });
};

onMounted(() => {
  initializeForm();
});

watch(() => props.initialData, () => {
  initializeForm();
}, { deep: true });

const submitForm = async () => {
  const { valid } = await formRef.value!.validate();
  if (valid) {
    if (props.submissionId) {
      emit('update', { id: props.submissionId, data: formData });
    } else {
      emit('submit', formData);
    }
  }
};
</script>
