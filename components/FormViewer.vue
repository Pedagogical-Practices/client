<template>
  <v-container fluid>
    <v-row v-for="(field, index) in formDefinition.fields" :key="field.name">
      <v-col cols="12">
        <component
          :is="getComponentName(field.type)"
          v-model="localFormData[field.name]"
          :label="field.label"
          :rules="
            field.rules
              ? field.rules.map(
                  (rule) => (v: any) =>
                    !!v || rule !== 'required' || 'Campo requerido'
                )
              : []
          "
          v-bind="getComponentProps(field)"
          variant="outlined"
          density="compact"
          class="mb-4"
        ></component>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import {
  VTextField,
  VTextarea,
  VSelect,
  VDatePicker,
} from "vuetify/components";
import { FormFieldType, type FormField } from "~/types";

export interface Form {
  id?: string;
  name: string;
  description?: string;
  fields: FormField[];
}

export interface Form {
  id?: string;
  name: string;
  description?: string;
  fields: FormField[];
}

const props = defineProps<{
  formDefinition: Form;
  modelValue: Record<string, any>;
}>();

const emit = defineEmits(["update:modelValue"]);

const localFormData = ref<Record<string, any>>({});

const componentMap: Record<FormFieldType, any> = {
  [FormFieldType.TEXT]: VTextField,
  [FormFieldType.TEXTAREA]: VTextarea,
  [FormFieldType.SELECT]: VSelect,
  [FormFieldType.DATE]: VDatePicker,
  [FormFieldType.MAP]: VTextField, // Placeholder for map component
  [FormFieldType.FILE_UPLOAD]: VTextField, // Placeholder for file upload
};

const getComponentName = (type: FormFieldType): any => {
  return componentMap[type] || VTextField;
};

const getComponentProps = (field: any) => {
  const props: Record<string, any> = {};

  if (field.type === FormFieldType.SELECT) {
    if (field.options && field.options.items) {
      props.items = field.options.items;
    }
  }

  return props;
};

watch(
  () => props.formDefinition,
  (newVal) => {
    if (newVal?.fields) {
      const currentModelValue = props.modelValue || {};
      localFormData.value = newVal.fields.reduce((acc, field) => {
        acc[field.name] =
          currentModelValue[field.name] !== undefined
            ? currentModelValue[field.name]
            : null;
        return acc;
      }, {});
    }
  },
  { immediate: true, deep: true }
);

watch(
  localFormData,
  (newVal) => {
    emit("update:modelValue", newVal);
  },
  { deep: true }
);
</script>
