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
                  :key="element.id"
                  class="form-element-item pa-3"
                  :class="{
                    'selected-element':
                      formElementStore.selectedElementId === element.id,
                  }"
                  @click="selectElementForEditing(element.id)"
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
                          :is="getComponentName(element)"
                          :model-value="element.value"
                          @update:model-value="
                            (newValue) =>
                              handleValueUpdate(element.id, newValue)
                          "
                          :label="element.label"
                          :placeholder="element.placeholder"
                          :hint="element.hint"
                          :persistent-hint="true"
                          :required="element.required"
                          :disabled="false"
                          :readonly="false"
                          :options="element.options"
                          :specific-type="element.specificType"
                          :height="element.height"
                          :color="element.color"
                          :rules="
                            element.required
                              ? [(v: any) => !!v || 'Requerido']
                              : []
                          "
                          :multiple="element.multiple"
                          :dataSource="element.dataSource"
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
                              formElementStore.moveElementUp(element.id)
                            "
                            title="Move Up"
                            icon="mdi-arrow-up-bold-outline"
                            :disabled="index === 0"
                          ></v-btn>
                          <v-btn
                            size="x-small"
                            variant="text"
                            color="primary"
                            @click.stop="selectElementForEditing(element.id)"
                            title="Edit Element"
                            icon="mdi-pencil-outline"
                          ></v-btn>
                          <v-btn
                            size="x-small"
                            variant="text"
                            color="error"
                            @click.stop="removeElement(element.id)"
                            title="Delete Element"
                            icon="mdi-delete-outline"
                          ></v-btn>
                          <v-btn
                            size="x-small"
                            variant="text"
                            color="grey-darken-1"
                            @click.stop="
                              formElementStore.moveElementDown(element.id)
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
                <!-- Reemplazar con el componente de editor JSON -->
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
            :formDefinition="{ fields: formElementStore.formElements }"
            :modelValue="{}"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import {
  useFormElementStore,
  type FormElement,
} from "~/stores/formElementStore";
import { useFormStore } from "~/stores/formStores";
import { useAuthStore } from "~/stores/authStore";
import AvailableElements from "~/components/AvailableElements.vue";
import {
  availableElements,
  type AvailableElementDefinition,
} from "~/components/formElementDefinitions";
import ElementEditor from "~/components/ElementEditor.vue";
import EntityAutocomplete from "~/components/EntityAutocomplete.vue"; // Import EntityAutocomplete
import FormViewer from "~/components/FormViewer.vue"; // Import FormViewer
import { useMutation } from "@vue/apollo-composable"; // Import useMutation
import CreateFormMutation from "~/queries/createForm.gql";
import UpdateFormMutation from "~/queries/updateForm.gql"; // Import CreateFormMutation
import {
  VTextField,
  VTextarea,
  VCheckbox,
  VSelect,
  VBtn,
  VRadioGroup,
  VDatePicker,
} from "vuetify/components";

definePageMeta({});

const router = useRouter();
const formElementStore = useFormElementStore();
const formStore = useFormStore();
const authStore = useAuthStore();
const show = ref<boolean>(false);
const isDragOver = ref<boolean>(false);
const showPreview = ref<boolean>(false); // Reactive variable for preview dialog
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

import DynamicSelect from "~/components/forms/DynamicSelect.vue";

const componentMap: Record<string, any> = {
  text: VTextField,
  textarea: VTextarea,
  checkbox: VCheckbox,
  select: VSelect,
  button: VBtn,
  "radio-group": VRadioGroup,
  "date-picker": VDatePicker,
};

const getComponentName = (element: FormElement): any => {
  console.log("getComponentName: Received element:", element);
  console.log(`getComponentName: Element type: ${element.type}, dataSource: ${element.dataSource}, dataSource.length: ${element.dataSource?.length}`);
  if (element.type === "select" && element.dataSource && element.dataSource.length > 0) {
    return DynamicSelect;
  }
  return componentMap[element.type] || VTextField;
};

const getElementIcon = (type: string): string => {
  const def = availableElements.find(
    (d: AvailableElementDefinition) => d.type === type
  );
  return def ? def.icon : "mdi-help-box";
};

const selectElementForEditing = (elementId: string): void => {
  formElementStore.setSelectedElement(elementId);
};

const removeElement = (elementId: string): void => {
  formElementStore.removeElement(elementId);
  if (formElementStore.selectedElementId === elementId) {
    formElementStore.setSelectedElement(null);
  }
};

const handleValueUpdate = (elementId: string, newValue: any) => {
  formElementStore.updateElementValue({ elementId, value: newValue });
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
    const { type: elementType } = JSON.parse(rawData) as { type: string };
    const elementDef = availableElements.find(
      (def: AvailableElementDefinition) => def.type === elementType
    );
    if (!elementDef) {
      throw new Error(`Tipo de elemento no encontrado: ${elementType}`);
    }
    const newElement: FormElement = {
      ...elementDef.defaultConfig,
      id: generateUniqueId(),
      type: elementDef.type,
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

const generateUniqueId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).substring(2, 9);

const createNewForm = (): void => {
  formElementStore.initializeForm([]);
  formStore.formName = "";
  formStore.clearEditingFormId(); // Clear the editing ID
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
    fields: formElementStore.formElements.map((el: FormElement) => {
      const outputEl: Record<string, any> = {
        id: el.id, // Keep id for internal editor use
        type: el.type,
        label: el.label,
        value: el.value,
        variableName: el.variableName,
        placeholder: el.placeholder,
        hint: el.hint,
        required: el.required, // Boolean
        chapter: el.chapter,
        question: el.question,
        questionNumber: el.questionNumber,
        consistencyCondition: el.consistencyCondition,
        inconsistencyMessage: el.inconsistencyMessage,
        errorType: el.errorType,
        description: el.description,
        requirementLevel: el.requirementLevel, // String (Required/Optional)
        rules: el.rules,
        name: el.name,
        disabled: el.disabled,
        readonly: el.readonly,
        specificType: el.specificType,
        dataSource: el.dataSource, // Add dataSource to the output
      };
      if (el.type === "select" || el.type === "radio-group") {
        outputEl.options = el.options;
        outputEl.multiple = el.multiple ?? false;
      }
      if (el.type === "textarea" && el.height) {
        outputEl.height = el.height;
      }
      if (el.type === "button" && el.color) {
        outputEl.color = el.color;
      }
      // Clean up undefined/null/empty array values, but keep false and empty strings
      Object.keys(outputEl).forEach((key) => {
        if (
          outputEl[key] === undefined ||
          outputEl[key] === null ||
          (Array.isArray(outputEl[key]) && outputEl[key].length === 0)
        ) {
          if (outputEl[key] !== false && outputEl[key] !== "") {
            delete outputEl[key];
          }
        }
      });
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
    const parsedJson = JSON.parse(editableFormJsonString.value) as {
      name: string;
      fields: any[];
    };
    if (!parsedJson.name || !Array.isArray(parsedJson.fields)) {
      throw new Error("El JSON debe contener 'name' y 'fields' como array");
    }
    const validElements = parsedJson.fields.every(
      (el: any) =>
        el.type && // Now expects 'type' (English)
        [
          "text",
          "textarea",
          "checkbox",
          "select",
          "button",
          "radio-group",
          "date-picker",
          "time-picker", // Added time-picker
        ].includes(el.type)
    );
    if (!validElements) {
      throw new Error("El JSON contiene elementos inválidos en 'fields'");
    }
    formStore.formName = parsedJson.name;
    console.log("JSON parseado para actualización:", parsedJson);
    formElementStore.initializeForm(
      parsedJson.fields.map(
        (el: any): FormElement => {
          console.log(`Procesando elemento JSON: ${el.id || 'nuevo'}, type: ${el.type}, dataSource: ${el.dataSource}`);
          return {
            id: el.id || generateUniqueId(), // Use existing id or generate new
            type: el.type,
            label: el.label ?? "",
            value: el.value ?? "",
            variableName: el.variableName ?? "",
            placeholder: el.placeholder ?? "",
            hint: el.hint ?? "",
            requirementLevel: el.required ? "Required" : "Optional", // Map boolean to string
            chapter: el.chapter ?? "",
            question: el.question ?? "",
            questionNumber: el.questionNumber ?? "",
            consistencyCondition: el.consistencyCondition ?? "",
            inconsistencyMessage: el.inconsistencyMessage ?? "",
            errorType: el.errorType ?? "Soft",
            description: el.description ?? "",
            name: el.name ?? "",
            disabled: !!el.disabled,
            readonly: !!el.readonly,
            options:
              el.options?.map((opt: any) => ({
                label: opt.label ?? opt.text ?? "", // Handle both 'label' and 'text'
                value: opt.value ?? "",
              })) ?? [],
            specificType: el.specificType ?? "",
            height: el.height ? String(el.height) : undefined, // Ensure string for height
            color: el.color ?? "",
            rules: el.rules ?? [],
            multiple: !!el.multiple,
            dataSource: el.dataSource !== undefined ? el.dataSource : null, // Ensure dataSource is always present, even if null
          };
        }
      )
    );
    console.log("Elementos de formulario en la store después de initializeForm:", formElementStore.formElements);
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

    const { mutate: createForm } = useMutation(CreateFormMutation);
    const { mutate: updateForm } = useMutation(UpdateFormMutation);

    let result;
    console.log("Guardando formulario con los siguientes datos:", {
      fields: formElementStore.formElements,
    });
    const formFields = formElementStore.formElements.map(
      (element: FormElement) => ({
        type: element.type,
        label: element.label ?? "",
        value:
          element.value !== undefined && element.value !== null
            ? String(element.value)
            : null,
        variableName: element.variableName ?? "",
        placeholder: element.placeholder ?? "",
        hint: element.hint ?? "",
        height: element.height ? String(element.height) : null,
        required: !!element.required,
        chapter: element.chapter ?? null,
        question: element.question ?? null,
        questionNumber: element.questionNumber ?? null,
        consistencyCondition: element.consistencyCondition ?? null,
        inconsistencyMessage: element.inconsistencyMessage ?? null,
        errorType: element.errorType ?? null,
        description: element.description ?? null,
        requirementLevel: element.requirementLevel ?? "Optional",
        options:
          element.options?.map((opt: any) =>
            typeof opt === "string"
              ? { value: opt, label: opt }
              : { value: opt.value, label: opt.text ?? opt.value }
          ) ?? [],
        disabled: !!element.disabled,
        readonly: !!element.readonly,
        name: element.name ?? null,
        specificType: element.specificType ?? null,
        color: element.color ?? null,
        rules: element.rules ?? [],
        multiple: !!element.multiple,
        dataSource: element.dataSource ?? null,
      })
    );

    if (formStore.editingFormId) {
      // Update existing form
      result = await updateForm({
        updateFormInput: {
          id: formStore.editingFormId,
          name: formStore.formName,
          fields: formFields,
        },
      });
    } else {
      // Create new form
      result = await createForm({
        createFormInput: {
          name: formStore.formName,
          fields: formFields,
        },
      });
    }

    if (result?.errors) {
      throw new Error(result.errors[0]?.message ?? "Error en la mutación");
    }

    // If a new form was created, store its ID
    if (!formStore.editingFormId && result?.data?.createForm?._id) {
      formStore.editingFormId = result.data.createForm._id;
    }

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
