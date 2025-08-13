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
                  (rule: any) => (v: any) =>
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
  VCheckbox,
  VRadioGroup,
} from "vuetify/components";
import MapInput from "~/components/forms/MapInput.vue";
import { VDateInput } from "vuetify/labs/VDateInput";
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
  modelValue: Record<string, any>;
}>();

const emit = defineEmits(["update:modelValue"]);

const localFormData = ref<Record<string, any>>({});
const dataSourceStore = useDataSourceStore();
const dynamicOptions = ref<Record<string, any[]>>({});

const componentMap: Record<FormFieldType, any> = {
  [FormFieldType.TEXT]: VTextField,
  [FormFieldType.TEXTAREA]: VTextarea,
  [FormFieldType.SELECT]: VSelect,
  [FormFieldType.DATE]: VDatePicker,
  [FormFieldType.MAP]: MapInput,
  [FormFieldType.FILE_UPLOAD]: VTextField,
  [FormFieldType.CHECKBOX]: VCheckbox,
  [FormFieldType.DATE_PICKER]: VDatePicker,
  [FormFieldType.DATE_INPUT]: VDateInput,
  [FormFieldType.RADIO_GROUP]: VRadioGroup,
  [FormFieldType.TIME_PICKER]: VTextField,
  [FormFieldType.BUTTON]: VTextField,
  [FormFieldType.AUTOCOMPLETE]: VTextField,
  [FormFieldType.NUMBER]: VTextField,
  [FormFieldType.EMAIL]: VTextField,
  [FormFieldType.PASSWORD]: VTextField,
};

const getComponentName = (type: FormFieldType): any => {
  return componentMap[type] || VTextField;
};

const getComponentProps = (field: FormField) => {
  const props: Record<string, any> = {
    label: field.label,
    placeholder: field.placeholder,
    hint: field.hint,
    required: field.required,
    disabled: field.disabled,
    readonly: field.readonly,
  };

  if (field.type === FormFieldType.SELECT) {
    if (field.dataSource) {
      props.items = dynamicOptions.value[field.dataSource] || [];
    } else if (field.options) {
      if (Array.isArray(field.options)) {
        props.items = field.options;
      } else {
        props.items = field.options.items || [];
      }
    }
    props.multiple = field.multiple || false;
  }

  if (field.type === FormFieldType.TEXTAREA) {
    props.rows = field.height || 4;
  }

  if (field.type === FormFieldType.CHECKBOX) {
    props.modelValue = field.value || false;
  }

  if (field.rules && field.rules.length > 0) {
    props.rules = field.rules.map((rule: string) => {
      if (rule === "required") {
        return (v: any) => !!v || "Campo requerido";
      }
      return true; // Default for other rules
    });
  }

  return props;
};

watch(
  () => props.formDefinition,
  async (newVal) => {
    console.log("Form definition updated:", newVal);
    if (newVal?.fields) {
      const currentModelValue = props.modelValue || {};
      localFormData.value = newVal.fields.reduce(
        (acc: Record<string, any>, field) => {
          acc[field.name] =
            currentModelValue[field.name] !== undefined
              ? currentModelValue[field.name]
              : null;
          return acc;
        },
        {} as Record<string, any>
      );

      // Cargar opciones dinámicas para SELECTs
      for (const field of newVal.fields) {
        if (field.type === FormFieldType.SELECT && field.dataSource) {
          if (!dynamicOptions.value[field.dataSource]) {
            const fetchedOptions = await dataSourceStore.fetchFormattedOptions(
              field.dataSource
            );
            // Directly use the array of objects returned by the store
            dynamicOptions.value[field.dataSource] = fetchedOptions;
          }
        }
      }
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
