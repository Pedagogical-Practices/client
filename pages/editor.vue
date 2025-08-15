<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="6">
        <v-text-field
          class="mt-4"
          variant="outlined"
          label="Nombre del Formulario"
          v-model="formStore.formName"
        ></v-text-field>
      </v-col>
      <!--v-chip v-if="formStore.currentForm?.version" color="info">
        Versión Actual: {{ formStore.currentForm?.version }}
        <span v-if="formStore.currentForm?.parentForm">
          (Basado en v{{ formStore.currentForm?.parentForm.version }})
        </span>
      </v-chip-->
      <v-col cols="6" class="d-flex justify-end align-center">
        <v-btn
          class="ma-1"
          color="primary"
          @click="createNewForm"
          icon="mdi-plus"
        >
        </v-btn>
        <v-btn
          class="ma-1"
          color="secondary"
          @click="saveFormToBackend"
          icon="mdi-content-save"
        >
        </v-btn>
        <v-btn
          class="ma-1"
          color="info"
          @click="showPreview = true"
          icon="mdi-eye"
        >
        </v-btn>
        <v-btn
          class="ma-1"
          color="success"
          @click="showBulkUpload = true"
          icon="mdi-upload-multiple"
        >
        </v-btn>
        <v-btn
          v-if="formStore.editingFormId"
          class="ma-1"
          color="purple"
          @click="createNewFormVersion"
          icon="mdi-content-copy"
          title="Crear Nueva Versión"
        >
        </v-btn>
        <v-btn
          class="ma-1"
          color="indigo"
          @click="viewForms"
          icon="mdi-form-select"
          title="Ver formularios"
        >
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="3" class="available-elements-col">
        <AvailableElements />
      </v-col>
      <v-col cols="12" md="9" class="form-builder-col">
        <v-card
          class="drop-zone mb-4 pa-2"
          :class="{ 'drag-over': isDragOver }"
          @dragover.prevent="handleDragOver"
          @dragleave="handleDragLeave"
          @drop.prevent="handleDrop"
        >
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Form Builder Canvas</span>
          </v-card-title>
          <v-card-text>
            <p
              v-if="formElementStore.formElements.length === 0 && !isDragOver"
              class="empty-form-message"
            >
              Arrastra elementos aquí o usa el panel para añadirlos.
            </p>
            <p v-if="isDragOver" class="drop-prompt-message">
              Suelta aquí para añadir el elemento.
            </p>
            <div
              v-if="formElementStore.formElements.length > 0"
              class="elements-list mt-3"
            >
              <ul>
                <li
                  v-for="(element, index) in formElementStore.formElements"
                  :key="element.name"
                  :ref="
                    (el) => {
                      if (el) elementRefs[index] = el;
                    }
                  "
                  class="form-element-item pa-3"
                  :class="{
                    'selected-element':
                      formElementStore.selectedElementName === element.name,
                  }"
                  @click="selectElementForEditing(element.name)"
                >
                  <div class="element-content">
                    <v-row>
                      <v-col cols="1">
                        <v-icon
                          :icon="getElementIcon(element.type)"
                          class="mr-3"
                        ></v-icon>
                      </v-col>
                      <v-col cols="10">
                        <component
                          :is="componentMap[element.type] || VTextField"
                          :model-value="element.value"
                          :label="element.label"
                          :rules="
                            element.rules
                              ? element.rules.map(
                                  (rule: any) => (v: any) =>
                                    !!v ||
                                    rule !== 'required' ||
                                    'Campo requerido'
                                )
                              : []
                          "
                          v-bind="getComponentProps(element)"
                          class="component-preview"
                          :field="element"
                        />
                      </v-col>
                      <v-col cols="1">
                        <div class="element-actions d-flex flex-column">
                          <v-btn
                            size="x-small"
                            variant="text"
                            color="grey-darken-1"
                            @click.stop="
                              formElementStore.moveElementUp(element.name)
                            "
                            title="Move Up"
                            icon="mdi-arrow-up-bold-outline"
                            :disabled="index === 0"
                          ></v-btn>
                          <v-btn
                            size="x-small"
                            variant="text"
                            color="primary"
                            @click.stop="selectElementForEditing(element.name)"
                            title="Edit Element"
                            icon="mdi-pencil-outline"
                          ></v-btn>
                          <v-btn
                            size="x-small"
                            variant="text"
                            color="info"
                            @click.stop="
                              formElementStore.duplicateElement(element.name)
                            "
                            title="Duplicate Element"
                            icon="mdi-content-copy"
                          ></v-btn>
                          <v-btn
                            size="x-small"
                            variant="text"
                            color="error"
                            @click.stop="removeElement(element.name)"
                            title="Delete Element"
                            icon="mdi-delete-outline"
                          ></v-btn>
                          <v-btn
                            size="x-small"
                            variant="text"
                            color="grey-darken-1"
                            @click.stop="
                              formElementStore.moveElementDown(element.name)
                            "
                            title="Move Down"
                            icon="mdi-arrow-down-bold-outline"
                            :disabled="
                              index === formElementStore.formElements.length - 1
                            "
                          ></v-btn>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </li>
              </ul>
            </div>
          </v-card-text>
        </v-card>
        <v-card class="mt-4 json-output-card">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>JSON Generado del Formulario</span>
          </v-card-title>

          <v-card-actions>
            <v-btn
              color="secondary"
              @click="copyJsonToClipboard"
              prepend-icon="mdi-content-copy"
            >
              Copiar JSON
            </v-btn>
            <v-btn
              color="primary"
              @click="updateFormFromJson"
              prepend-icon="mdi-upload"
            >
              Actualizar Formulario
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              @click="show = !show"
            ></v-btn>
          </v-card-actions>
          <v-expand-transition>
            <div v-show="show">
              <v-divider></v-divider>
              <v-card-text class="pa-2">
                <v-card-text class="pa-2">
                  <v-textarea
                    v-model="editableFormJsonString"
                    label="Salida JSON del Formulario"
                    auto-grow
                    rows="10"
                    density="compact"
                    class="json-output-textarea"
                  ></v-textarea>
                </v-card-text>
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
    <ElementEditor />
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="top right"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="showPreview" fullscreen>
      <v-card>
        <v-card-title
          class="d-flex justify-space-between align-center headline-bar"
        >
          <span class="text-h6 font-weight-medium"
            >Previsualización del Formulario</span
          >
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="showPreview = false"
          ></v-btn>
        </v-card-title>
        <v-card-text>
          <FormViewer
            :formDefinition="{
              name: formStore.formName,
              fields: formElementStore.formElements,
            }"
            :modelValue="{}"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showBulkUpload" max-width="800px">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Carga Masiva de Formularios</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="showBulkUpload = false"
          ></v-btn>
        </v-card-title>
        <v-card-text>
          <BulkFormUploader />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useFormElementStore } from "~/stores/formElementStore";
import { useFormStore } from "~/stores/formStore";
import { useAuthStore } from "~/stores/authStore";
import AvailableElements from "~/components/AvailableElements.vue";
import { availableElements } from "~/components/formElementDefinitions";
import ElementEditor from "~/components/ElementEditor.vue";
import FormViewer from "~/components/FormViewer.vue";
import BulkFormUploader from "~/components/forms/BulkFormUploader.vue";
import DynamicSelect from "~/components/forms/DynamicSelect.vue";
import CheckboxGroup from "~/components/forms/CheckboxGroup.vue";
import RadioGroup from "~/components/forms/RadioGroup.vue";
import Repeater from "~/components/forms/Repeater.vue";
import RadioMatrix from "~/components/forms/RadioMatrix.vue";

import { type AvailableElementDefinition } from "~/types";
import {
  VTextField,
  VTextarea,
  VSelect,
  VDatePicker,
  VCheckbox,
} from "vuetify/components";
import { VDateInput } from "vuetify/labs/VDateInput";
import MapInput from "~/components/forms/MapInput.vue";
import TypographyElement from "~/components/forms/TypographyElement.vue";
import { definePageMeta } from "#imports";
import { FormFieldType, type FormField } from "~/types";

definePageMeta({});

const router = useRouter();
const route = useRoute();
const formElementStore = useFormElementStore();
const formStore = useFormStore();
const authStore = useAuthStore();
const show = ref<boolean>(false);
const isDragOver = ref<boolean>(false);
const showPreview = ref<boolean>(false);
const showBulkUpload = ref<boolean>(false);
const elementRefs = ref<any[]>([]);
const snackbar = ref<{
  show: boolean;
  text: string;
  color: string;
  timeout: number;
}>({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

watch(
  () => formElementStore.formElements,
  (newElements, oldElements) => {
    if (newElements.length > oldElements.length) {
      // Element was added
      nextTick(() => {
        const lastElementRef = elementRefs.value[newElements.length - 1];
        if (lastElementRef) {
          lastElementRef.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      });
    }
  },
  { deep: true }
);

watch(
  () => route.query.id,
  async (newId) => {
    if (newId && typeof newId === "string" && newId.length > 0) {
      try {
        await formStore.fetchFormById(newId);
      } catch (error: any) {
        console.error(
          "Error loading form by ID, resetting to new form:",
          error
        );
        formStore.clearEditingFormId();
        formElementStore.initializeForm([]);
        formStore.formName = "";
        snackbar.value = {
          show: true,
          text: `Error al cargar el formulario: ${
            error.message || "Formulario no encontrado"
          }. Creando nuevo formulario.`,
          color: "error",
          timeout: 5000,
        };
      }
    } else {
      formStore.clearEditingFormId();
      formElementStore.initializeForm([]);
      formStore.formName = "";
    }
  },
  { immediate: true }
);

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
  [FormFieldType.DATE_PICKER]: VDatePicker,
  [FormFieldType.DATE_INPUT]: VDateInput,
  [FormFieldType.TIME_PICKER]: VTextField,
  [FormFieldType.BUTTON]: VTextField,
  [FormFieldType.AUTOCOMPLETE]: VTextField,
  [FormFieldType.NUMBER]: VTextField,
  [FormFieldType.EMAIL]: VTextField,
  [FormFieldType.PASSWORD]: VTextField,
  [FormFieldType.RADIOMATRIX]: RadioMatrix,
};

const getComponentProps = (field: FormField) => {
  const props: Record<string, any> = {
    variant: "outlined", // Apply variant to all for consistency
  };

  if (field.type === FormFieldType.SELECT_DYNAMIC) {
    props.field = field;
  } else if (field.type === FormFieldType.SELECT_SIMPLE) {
    if (Array.isArray(field.options)) {
      props.items = field.options;
    }
    props.multiple = field.multiple || false;
    props['item-title'] = 'label';
    props['item-value'] = 'value';
  } else if (
    field.type === FormFieldType.CHECKBOX_GROUP ||
    field.type === FormFieldType.RADIO_GROUP
  ) {
    props.options = field.options || [];
  } else if (
    field.type === FormFieldType.TYPOGRAPHY_HEADING ||
    field.type === FormFieldType.TYPOGRAPHY_BODY
  ) {
    props.value = field.value;
    props.variant = field.variant; // Allow override for typography
    props.fontWeight = field.fontWeight;
    props.textAlign = field.textAlign;
    props.textDecoration = field.textDecoration;
    props.textTransform = field.textTransform;
    props.tag = field.tag;
  }

  return props;
};

const getElementIcon = (type: FormFieldType): string => {
  const def = availableElements.find(
    (d: AvailableElementDefinition) => d.type === type
  );
  return def ? def.icon : "mdi-help-box";
};

const selectElementForEditing = (elementName: string): void => {
  formElementStore.setSelectedElement(elementName);
};

const removeElement = (elementName: string): void => {
  formElementStore.removeElement(elementName);
  if (formElementStore.selectedElementName === elementName) {
    formElementStore.setSelectedElement(null);
  }
};

const handleDragOver = (event: DragEvent): void => {
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
  isDragOver.value = true;
};

const handleDragLeave = (): void => {
  isDragOver.value = false;
};

const handleDrop = (event: DragEvent): void => {
  event.preventDefault();
  isDragOver.value = false;
  if (!event.dataTransfer) return;

  const rawData = event.dataTransfer.getData("application/json");
  try {
    const { type: elementType, name: elementName } = JSON.parse(rawData) as {
      type: FormFieldType;
      name: string;
    };
    const elementDef = availableElements.find(
      (def: AvailableElementDefinition) => def.type === elementType
    );
    if (!elementDef) {
      throw new Error(`Tipo de elemento no encontrado: ${elementType}`);
    }
    const newElement: FormField = {
      ...elementDef.defaultConfig,
      name: elementName,
      type: elementType as FormFieldType,
    };
    formElementStore.addElement(newElement);
  } catch (error: any) {
    console.error("Error al parsear datos arrastrados:", error);
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: "error",
      timeout: 3000,
    };
  }
};

const createNewForm = (): void => {
  formElementStore.initializeForm([]);
  formStore.formName = "";
  formStore.clearEditingFormId();
  formElementStore.setSelectedElement(null);
  editableFormJsonString.value = JSON.stringify(
    { name: "", fields: [] },
    null,
    2
  );
  snackbar.value = {
    show: true,
    text: "¡Nuevo formulario creado!",
    color: "success",
    timeout: 3000,
  };
};

const transformedFormJson = computed(() => {
  return {
    name: formStore.formName,
    fields: formElementStore.formElements.map((el: FormField) => {
      return el;
    }),
  };
});

const transformedFormJsonString = computed(() =>
  JSON.stringify(transformedFormJson.value, null, 2)
);

const editableFormJsonString = ref<string>(transformedFormJsonString.value);

watch(transformedFormJsonString, (newVal: string) => {
  editableFormJsonString.value = newVal;
});

const copyJsonToClipboard = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(editableFormJsonString.value);
    snackbar.value = {
      show: true,
      text: "¡JSON copiado al portapapeles!",
      color: "success",
      timeout: 3000,
    };
  } catch (error: any) {
    console.error("Error al copiar JSON:", error);
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: "error",
      timeout: 3000,
    };
  }
};

const updateFormFromJson = async (): Promise<void> => {
  try {
    const parsedJson = JSON.parse(editableFormJsonString.value) as {
      name: string;
      fields: FormField[];
    };
    if (!parsedJson.name || !Array.isArray(parsedJson.fields)) {
      throw new Error("El JSON debe contener 'name' y 'fields' como array");
    }

    const validElements = parsedJson.fields.every(
      (el: FormField) =>
        Object.values(FormFieldType).includes(el.type as FormFieldType) &&
        el.name &&
        el.label
    );

    if (!validElements) {
      throw new Error("El JSON contiene elementos inválidos en 'fields'");
    }
    formStore.formName = parsedJson.name;
    formElementStore.initializeForm(parsedJson.fields);
    snackbar.value = {
      show: true,
      text: "¡Formulario actualizado desde JSON!",
      color: "success",
      timeout: 3000,
    };
  } catch (error: any) {
    console.error("Error al actualizar desde JSON:", error);
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: "error",
      timeout: 3000,
    };
  }
};

const saveFormToBackend = async (): Promise<void> => {
  try {
    if (!authStore.isAuthenticated) {
      throw new Error(
        "No se encontró el token de autenticación. Por favor inicia sesión."
      );
    }
    if (!formStore.formName) {
      throw new Error("El nombre del formulario es obligatorio.");
    }

    let result;
    const formFields = formElementStore.formElements.map(
      (element: FormField) => {
        const { id, __typename, ...rest } = element; // Omit id and __typename
        return rest;
      }
    );

    if (formStore.editingFormId) {
      result = await formStore.updateForm(formStore.editingFormId, {
        name: formStore.formName,
        fields: formFields,
      });
    } else {
      result = await formStore.createForm({
        name: formStore.formName,
        fields: formFields,
      });
    }

    if (!result) {
      throw new Error("Error al guardar el formulario en el backend.");
    }

    if (!formStore.editingFormId && result?.id) {
      formStore.editingFormId = result.id;
    }

    formStore.clearEditingFormId();
    formElementStore.initializeForm([]);
    formStore.formName = "";
    snackbar.value = {
      show: true,
      text: "¡Formulario guardado exitosamente!",
      color: "success",
      timeout: 3000,
    };
    router.push("/admin/forms");
  } catch (error: any) {
    console.error("Error al guardar:", error);
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: "error",
      timeout: 3000,
    };
  }
};

const createNewFormVersion = async () => {
  if (!formStore.editingFormId) {
    snackbar.value = {
      show: true,
      text: "Debe cargar un formulario existente para crear una nueva versión.",
      color: "warning",
      timeout: 3000,
    };
    return;
  }
  try {
    const newForm = await formStore.createNewFormVersion(
      formStore.editingFormId
    );
    snackbar.value = {
      show: true,
      text: `¡Nueva versión del formulario creada exitosamente! (v${newForm.version})`,
      color: "success",
      timeout: 3000,
    };
    router.push(`/editor?id=${newForm.id}`);
  } catch (error: any) {
    console.error("Error al crear nueva versión:", error);
    snackbar.value = {
      show: true,
      text: `Error al crear nueva versión: ${error.message}`,
      color: "error",
      timeout: 3000,
    };
  }
};

const viewForms = () => {
  router.push("/admin/forms");
};
</script>

<style scoped>
.app-main-content {
  background-color: #f7f8fc;
}
.available-elements-col {
  height: calc(
    100vh - 150px
  ); /* Adjust height considering header/other elements */
  overflow-y: auto;
  position: sticky;
  top: 80px; /* Adjust top position */
}
.form-builder-col {
  height: calc(100vh - 150px); /* Match the height */
  overflow-y: auto; /* Make this column scrollable */
}
.drop-zone {
  border: 2px dashed #bdbdbd;
  padding: 16px;
  min-height: 100%; /* Make drop zone fill the scrollable area */
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
  background-color: #fff;
}
.drop-zone.drag-over {
  background-color: #e3f2fd;
  border-color: #2196f3;
}
.empty-form-message,
.drop-prompt-message {
  text-align: center;
  color: #757575;
  font-style: italic;
  margin-top: 20px;
  padding: 10px;
}
.elements-list {
  margin-top: 15px;
}
.form-element-item {
  margin-bottom: 12px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    border-left 0.2s ease;
  border-left: 4px solid transparent;
}
.form-element-item:hover {
  background-color: #f5f5f5;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.form-element-item.selected-element {
  border-left: 4px solid #1976d2;
  background-color: #e3f2fd;
}
.element-content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 8px;
}
.element-label {
  flex: 0 0 150px;
  font-size: 0.9rem;
  margin-right: 16px;
}
.element-actions {
  display: flex;
  align-items: center;
}
.json-output-card {
  background-color: #fff;
}
.json-output-textarea .v-textarea__slot textarea {
  font-family: "Roboto Mono", monospace !important;
  font-size: 0.8rem !important;
  line-height: 1.4 !important;
}
ul {
  list-style-type: none;
  padding-left: 0;
}
</style>
