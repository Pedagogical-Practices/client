<template>
  <v-card class="pa-4" variant="outlined">
    <v-card-title class="text-h5">{{ formDefinition.name }}</v-card-title>
    <v-card-text>
      <v-form ref="formRef">
        <div v-for="field in formDefinition.fields" :key="field.name">
          <component
            :is="componentMap[field.type] || VTextField"
            v-model="formData[field.name]"
            v-bind="getComponentProps(field)"
            class="mb-4"
            variant="outlined"
          />
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="submitForm">{{
        submissionId ? "Actualizar" : "Enviar"
      }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import {
  VTextField,
  VTextarea,
  VSelect,
  VDatePicker,
  VCheckbox,
} from "vuetify/components";
import MapInput from "~/components/forms/MapInput.vue";
import { VDateInput } from "vuetify/labs/VDateInput";
import { FormFieldType, type FormField } from "~/types";
import { useDataSourceStore } from "~/stores/dataSourceStore";
import CheckboxGroup from "~/components/forms/CheckboxGroup.vue";
import DynamicSelect from "~/components/forms/DynamicSelect.vue";
import RadioGroup from "~/components/forms/RadioGroup.vue";
import TypographyElement from "~/components/forms/TypographyElement.vue";
import Repeater from "~/components/forms/Repeater.vue";
import Radiomatrix from "~/components/forms/RadioMatrix.vue";

const props = defineProps<{
  formDefinition: any;
  initialData?: Record<string, any>;
  submissionId?: string | null;
}>();

const emit = defineEmits(["submit", "update"]);

const formRef = ref<HTMLFormElement | null>(null);
const formData = reactive<Record<string, any>>({});
const dataSourceStore = useDataSourceStore();

const dynamicSelectOptions = reactive<
  Map<string, Array<{ title: string; value: string }>>
>(new Map());

const componentMap: Record<FormFieldType, any> = {
  [FormFieldType.TEXT]: VTextField,
  [FormFieldType.TEXTAREA]: VTextarea,
  [FormFieldType.SELECT_SIMPLE]: VSelect,
  [FormFieldType.SELECT_DYNAMIC]: DynamicSelect,
  [FormFieldType.DATE]: VDatePicker,
  [FormFieldType.MAP]: MapInput,
  [FormFieldType.FILE_UPLOAD]: VTextField,
  [FormFieldType.CHECKBOX]: VCheckbox,
  [FormFieldType.CHECKBOX_GROUP]: CheckboxGroup,
  [FormFieldType.RADIO_GROUP]: RadioGroup,
  [FormFieldType.TYPOGRAPHY_HEADING]: TypographyElement,
  [FormFieldType.TYPOGRAPHY_BODY]: TypographyElement,
  [FormFieldType.REPEATER]: Repeater,
  [FormFieldType.RADIOMATRIX]: Radiomatrix,
  [FormFieldType.DATE_PICKER]: VDatePicker,
  [FormFieldType.DATE_INPUT]: VDateInput,
  [FormFieldType.TIME_PICKER]: VTextField,
  [FormFieldType.BUTTON]: VTextField,
  [FormFieldType.AUTOCOMPLETE]: VTextField,
  [FormFieldType.NUMBER]: VTextField,
  [FormFieldType.EMAIL]: VTextField,
  [FormFieldType.PASSWORD]: VTextField,
};

const getComponentProps = (field: FormField) => {
  const props: Record<string, any> = {
    label: field.label,
    placeholder: field.placeholder,
    hint: field.hint,
    required: field.required,
    disabled: field.disabled,
    readonly: field.readonly,
    rules: field.rules ? field.rules.map((rule: any) => (v: any) => !!v || rule !== 'required' || 'Campo requerido') : [],
  };

  if (field.type === FormFieldType.SELECT_DYNAMIC) {
    props.field = field;
  } else if (field.type === FormFieldType.SELECT_SIMPLE) {
    if (field.options) {
      if (Array.isArray(field.options)) {
        props.items = field.options;
      } else {
        props.items = field.options.items || [];
      }
    }
    props.multiple = field.multiple || false;
  } else if (
    field.type === FormFieldType.CHECKBOX_GROUP ||
    field.type === FormFieldType.RADIO_GROUP ||
    field.type === FormFieldType.REPEATER
  ) {
    props.options = field.options || [];
  } else if (field.type === FormFieldType.RADIOMATRIX) {
    props.items = field.options?.items || [];
    props.options = field.options?.columns || [];
  } else if (
    field.type === FormFieldType.TYPOGRAPHY_HEADING ||
    field.type === FormFieldType.TYPOGRAPHY_BODY
  ) {
    props.value = field.value;
    props.variant = field.variant;
    props.fontWeight = field.fontWeight;
    props.textAlign = field.textAlign;
    props.textDecoration = field.textDecoration;
    props.textTransform = field.textTransform;
    props.tag = field.tag;
  }

  if (field.type === FormFieldType.TEXTAREA) {
    props.rows = field.height || 4;
  }

  if (field.type === FormFieldType.CHECKBOX) {
    props.modelValue = field.value || false;
  }

  return props;
};

const initializeForm = async () => {
  const data = props.initialData || {};
  console.log("FormFiller.vue: initializeForm - using data:", data);

  for (const key in formData) {
    delete formData[key];
  }

  for (const field of props.formDefinition.fields) {
    formData[field.name] =
      data[field.name] !== undefined ? data[field.name] : null;

    if (field.type === FormFieldType.SELECT_DYNAMIC && field.dataSource) {
      try {
        const options = await dataSourceStore.fetchFormattedOptions(
          field.dataSource
        );
        dynamicSelectOptions.set(field.name, options);
      } catch (error) {
        console.error(
          `Error fetching data for ${field.name} (${field.dataSource}):`,
          error
        );
        dynamicSelectOptions.set(field.name, []);
      }
    }
  }
};

onMounted(() => {
  console.log("FormFiller.vue: onMounted - initialData:", props.initialData);
  console.log(
    "FormFiller.vue: onMounted - formDefinition:",
    props.formDefinition
  );
  initializeForm();
});

watch(
  () => props.initialData,
  (newData) => {
    console.log("FormFiller.vue: watch - initialData changed to:", newData);
    initializeForm();
  },
  { deep: true }
);

const submitForm = async () => {
  const { valid } = await formRef.value!.validate();
  if (valid) {
    if (props.submissionId) {
      emit("update", { id: props.submissionId, data: formData });
    } else {
      emit("submit", formData);
    }
  }
};
</script>
