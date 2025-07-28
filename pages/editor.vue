<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-text-field
          variant="outlined"
          label="Nombre del Formulario"
          v-model="formStore.formName"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4" class="available-elements-col">
        <AvailableElements />
      </v-col>
      <v-col cols="12" md="8" class="form-builder-col">
        <v-card
          class="drop-zone mb-4 pa-2"
          :class="{ 'drag-over': isDragOver }"
          @dragover.prevent="handleDragOver"
          @dragleave="handleDragLeave"
          @drop.prevent="handleDrop"
        >
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Form Builder Canvas</span>
            <div>
              <v-btn
                color="primary"
                @click="saveFormToBackend"
                icon="mdi-content-save"
                class="mr-2"
                title="Guardar Formulario"
              ></v-btn>
              <v-btn
                color="secondary"
                @click="createNewForm"
                icon="mdi-file-document-plus"
                class="mr-2"
                title="Nuevo Formulario"
              ></v-btn>
              <v-btn
                color="info"
                @click="showPreview = true"
                icon="mdi-eye"
                title="Previsualizar Formulario"
              ></v-btn>
              <v-btn
                color="success"
                @click="showBulkUpload = true"
                icon="mdi-upload-multiple"
                title="Cargar Formularios"
              ></v-btn>
            </div>
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
                          :is="getComponentName(element.type)"
                          :model-value="element.label"
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
                          variant="outlined"
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
          <v-btn icon="mdi-close" variant="text" @click="showBulkUpload = false"></v-btn>
        </v-card-title>
        <v-card-text>
          <BulkFormUploader />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useFormElementStore } from "~/stores/formElementStore";
import { useFormStore } from "~/stores/formStore";
import { useAuthStore } from "~/stores/authStore";
import AvailableElements from "~/components/AvailableElements.vue";
import {
  availableElements,
  type AvailableElementDefinition,
} from "~/components/formElementDefinitions";
import ElementEditor from "~/components/ElementEditor.vue";
import FormViewer from "~/components/FormViewer.vue";
import BulkFormUploader from '~/components/forms/BulkFormUploader.vue';
// import { useMutation } from "@vue/apollo-composable";
// import { gql } from "graphql-tag";
import {
  VTextField,
  VTextarea,
  VSelect,
  VDatePicker,
} from "vuetify/components";
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
  () => route.params.id,
  async (newId) => {
    if (newId) {
      try {
        await formStore.fetchFormById(newId as string);
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
          text: `Error al cargar el formulario: ${error.message || "Formulario no encontrado"}. Creando nuevo formulario.`,
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
  [FormFieldType.SELECT]: VSelect,
  [FormFieldType.DATE]: VDatePicker,
  [FormFieldType.MAP]: VTextField,
  [FormFieldType.FILE_UPLOAD]: VTextField,
  [FormFieldType.CHECKBOX]: VTextField,
  [FormFieldType.DATE_PICKER]: VDatePicker,
  [FormFieldType.RADIO_GROUP]: VTextField,
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
  const props: Record<string, any> = {};

  if (field.type === FormFieldType.SELECT) {
    if (
      field.options &&
      typeof field.options === "object" &&
      !Array.isArray(field.options) &&
      "items" in field.options
    ) {
      props.items = (field.options as { items: any[] }).items;
    }
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
  console.log("Editor: selectElementForEditing called for:", elementName);
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
      const outputEl: FormField = {
        name: el.name,
        label: el.label,
        type: el.type,
        options: el.options,
        rules: el.rules,
      };
      return outputEl;
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
    console.log("Updating form from JSON:", editableFormJsonString.value);
    const parsedJson = JSON.parse(editableFormJsonString.value) as {
      name: string;
      fields: FormField[];
    };
    console.log("Parsed JSON:", parsedJson);
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
      (element: FormField) => ({
        name: element.name,
        label: element.label,
        type: element.type,
        options: element.options,
        rules: element.rules,
      })
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
    router.push("/forms");
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
</script>

<style scoped>
.app-main-content {
  background-color: #f7f8fc;
}
.available-elements-col {
  height: calc(100vh - 64px);
  overflow-y: auto;
  position: sticky;
  top: 64px;
}
.form-builder-col {
}
.drop-zone {
  border: 2px dashed #bdbdbd;
  padding: 16px;
  min-height: 250px;
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
