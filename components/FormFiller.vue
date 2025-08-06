<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5">{{ formDefinition.name }}</v-card-title>
    <v-card-text>
      <v-form ref="formRef">
        <div v-for="field in formDefinition.fields" :key="field.name">
          <component
            :is="getComponentName(field)"
            v-model="formData[field.name]"
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
} from "vuetify/components";
import { FormFieldType } from "~/types";
import { useDataSourceStore } from "~/stores/dataSourceStore";

const props = defineProps<{
  formDefinition: any;
  initialData?: Record<string, any>;
  submissionId?: string | null;
}>();

const emit = defineEmits(["submit", "update"]);

const formRef = ref<HTMLFormElement | null>(null);
const formData = reactive<Record<string, any>>({});
const dataSourceStore = useDataSourceStore();

const componentMap: Record<FormFieldType, any> = {
  [FormFieldType.TEXT]: VTextField,
  [FormFieldType.TEXTAREA]: VTextarea,
  [FormFieldType.SELECT]: VSelect,
  [FormFieldType.DATE]: VDatePicker,
  [FormFieldType.MAP]: VTextField,
  [FormFieldType.FILE_UPLOAD]: VTextField,
  [FormFieldType.CHECKBOX]: VTextField,
  [FormFieldType.DATE_PICKER]: VDatePicker,
  [FormFieldType.DATE_INPUT]: VTextField,
  [FormFieldType.RADIO_GROUP]: VTextField,
  [FormFieldType.TIME_PICKER]: VTextField,
  [FormFieldType.BUTTON]: VTextField,
  [FormFieldType.AUTOCOMPLETE]: VTextField,
  [FormFieldType.NUMBER]: VTextField,
  [FormFieldType.EMAIL]: VTextField,
  [FormFieldType.PASSWORD]: VTextField,
};

const getComponentName = (field: { type: FormFieldType }): any => {
  return componentMap[field.type] || VTextField;
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

const initializeForm = () => {
  const data = props.initialData || {};
  console.log("FormFiller.vue: initializeForm - using data:", data);

  // Clear existing properties from formData to ensure a fresh state
  for (const key in formData) {
    delete formData[key];
  }

  props.formDefinition.fields.forEach((field: any) => {
    formData[field.name] =
      data[field.name] !== undefined ? data[field.name] : null;
  });
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
