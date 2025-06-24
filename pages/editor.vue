<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-text-field
          variant="outlined"
          label="Nombre del Formulario"
          v-model="formBuilderStore.formName"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <!-- Available Elements Column (hidden on mobile if drawer is used) -->
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
                prepend-icon="mdi-content-save"
                class="mr-2"
              >
                Guardar Formulario
              </v-btn>
              <v-btn
                color="secondary"
                @click="createNewForm"
                prepend-icon="mdi-file-document-plus"
              >
                Nuevo Formulario
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <p
              v-if="formBuilderStore.formElements.length === 0 && !isDragOver"
              class="empty-form-message"
            >
              Arrastra elementos aquí o usa el panel para añadirlos.
            </p>
            <p v-if="isDragOver" class="drop-prompt-message">
              Suelta aquí para añadir el elemento.
            </p>

            <div
              v-if="formBuilderStore.formElements.length > 0"
              class="elements-list mt-3"
            >
              <ul>
                <li
                  v-for="element in formBuilderStore.formElements"
                  :key="element.id"
                  class="form-element-item pa-3"
                  :class="{
                    'selected-element':
                      formBuilderStore.selectedElementId === element.id,
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
                          :is="getComponentName(element.type)"
                          v-model="element.value"
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
                            element.required ? [(v) => !!v || 'Requerido'] : []
                          "
                          :multiple="element.multiple"
                          class="component-preview"
                          variant="outlined"
                        />
                      </v-col>
                      <v-col cols="1">
                        <div class="element-actions">
                          <v-btn
                            size="small"
                            variant="text"
                            color="primary"
                            @click.stop="selectElementForEditing(element.id)"
                            title="Editar Elemento"
                            icon="mdi-pencil-outline"
                          ></v-btn>
                          <v-btn
                            size="small"
                            variant="text"
                            color="error"
                            @click.stop="removeElement(element.id)"
                            title="Eliminar Elemento"
                            icon="mdi-delete-outline"
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
                <v-textarea
                  v-model="editableFormJsonString"
                  label="Salida JSON del Formulario"
                  auto-grow
                  rows="10"
                  density="compact"
                  class="json-output-textarea"
                ></v-textarea>
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
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useFormBuilderStore } from "~/stores/formBuilderStore";
import { useAuthStore } from "~/stores/authStore";
import AvailableElements from "~/components/AvailableElements.vue";
import ElementEditor from "~/components/ElementEditor.vue";
import { availableElements as elementDefinitions } from "~/components/formElementDefinitions";
import type { FormElement } from "~/stores/formBuilderStore";
import {
  VTextField,
  VTextarea,
  VCheckbox,
  VSelect,
  VBtn,
  VRadioGroup,
  VDatePicker,
} from "vuetify/components";

// Middleware para admin
definePageMeta({
  middleware: ["admin"],
});

const router = useRouter();
const formBuilderStore = useFormBuilderStore();
const authStore = useAuthStore();
const show = ref(false);
const isDragOver = ref(false);
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

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

const getElementIcon = (type: string): string => {
  const def = elementDefinitions.find((d) => d.type === type);
  return def ? def.icon : "mdi-help-box";
};

const selectElementForEditing = (elementId: string) => {
  formBuilderStore.setSelectedElement(elementId);
};

const removeElement = (elementId: string) => {
  formBuilderStore.removeElement(elementId);
  if (formBuilderStore.selectedElementId === elementId) {
    formBuilderStore.setSelectedElement(null);
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;
  if (event.dataTransfer) {
    const rawData = event.dataTransfer.getData("application/json");
    try {
      const { type: elementType } = JSON.parse(rawData) as { type: string };
      const elementDef = elementDefinitions.find(
        (def) => def.type === elementType
      );
      if (elementDef) {
        const newElement: FormElement = {
          ...JSON.parse(JSON.stringify(elementDef.defaultConfig)),
          id: generateUniqueId(),
          type: elementDef.type,
        };
        formBuilderStore.addElement(newElement);
      } else {
        console.error("Dropped element type not found:", elementType);
      }
    } catch (error: any) {
      console.error("Failed to parse dropped data:", error);
      snackbar.value = {
        show: true,
        text: `Error: ${error.message}`,
        color: "error",
        timeout: 3000,
      };
    }
  }
};

const generateUniqueId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).substring(2, 9);

const createNewForm = () => {
  formBuilderStore.initializeForm([]);
  formBuilderStore.formName = "";
  formBuilderStore.setSelectedElement(null);
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
    name: formBuilderStore.formName,
    fields: formBuilderStore.formElements.map((el) => {
      const outputEl: Record<string, any> = {
        id: el.id,
        tipo: el.type,
        etiqueta: el.label,
        valor: el.value,
        nombreVariable: el.variableName,
        placeholder: el.placeholder,
        textoAyuda: el.hint,
        obligatoriedad: el.requirementLevel,
        capitulo: el.chapter,
        pregunta: el.question,
        numeroPregunta: el.questionNumber,
        condicionConsistencia: el.consistencyCondition,
        mensajeInconsistencia: el.inconsistencyMessage,
        tipoError: el.errorType,
        descripcion: el.description,
        reglas: el.rules,
        nombre: el.name,
        deshabilitado: el.disabled,
        soloLectura: el.readonly,
        subtipo: el.specificType,
      };
      if (el.type === "select" || el.type === "radio-group") {
        outputEl.opciones = el.options;
        outputEl.multiple = el.multiple || false;
      }
      if (el.type === "textarea" && el.height) {
        outputEl.altura = el.height;
      }
      if (el.type === "button" && el.color) {
        outputEl.color = el.color;
      }
      Object.keys(outputEl).forEach((key) => {
        if (
          outputEl[key] === undefined ||
          outputEl[key] === null ||
          (Array.isArray(outputEl[key]) && outputEl[key].length === 0)
        ) {
          if (outputEl[key] !== "" && outputEl[key] !== false) {
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

const editableFormJsonString = ref(transformedFormJsonString.value);

watch(transformedFormJsonString, (newVal) => {
  editableFormJsonString.value = newVal;
});

const copyJsonToClipboard = async () => {
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

const updateFormFromJson = async () => {
  try {
    const parsedJson = JSON.parse(editableFormJsonString.value);
    if (!parsedJson.name || !Array.isArray(parsedJson.fields)) {
      throw new Error("El JSON debe contener 'name' y 'fields' como array");
    }
    // Validar que los elementos tengan la estructura correcta
    const validElements = parsedJson.fields.every(
      (el: any) =>
        el.id &&
        el.tipo &&
        [
          "text",
          "textarea",
          "checkbox",
          "select",
          "button",
          "radio-group",
          "date-picker",
        ].includes(el.tipo)
    );
    if (!validElements) {
      throw new Error("El JSON contiene elementos inválidos en 'fields'");
    }
    // Actualizar el store con el nombre y los elementos
    formBuilderStore.formName = parsedJson.name;
    formBuilderStore.initializeForm(
      parsedJson.fields.map((el: any) => ({
        id: el.id,
        type: el.tipo,
        label: el.etiqueta,
        value: el.valor || "",
        variableName: el.nombreVariable || "",
        placeholder: el.placeholder || "",
        hint: el.textoAyuda || "",
        requirementLevel: el.obligatoriedad || "Optional",
        chapter: el.capitulo || "",
        question: el.pregunta || "",
        questionNumber: el.numeroPregunta || "",
        consistencyCondition: el.condicionConsistencia || "",
        inconsistencyMessage: el.mensajeInconsistencia || "",
        errorType: el.tipoError || "Soft",
        description: el.descripcion || "",
        name: el.nombre || "",
        disabled: !!el.deshabilitado,
        readonly: !!el.soloLectura,
        options: el.opciones || [],
        specificType: el.subtipo || "",
        height: el.altura ? Number(el.altura) : undefined,
        color: el.color || "",
        rules: el.reglas || [],
        multiple: !!el.multiple,
      }))
    );
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

const saveFormToBackend = async () => {
  try {
    if (!authStore.token) {
      throw new Error(
        "No se encontró el token de autenticación. Por favor inicia sesión."
      );
    }
    if (!formBuilderStore.formName) {
      throw new Error("El nombre del formulario es obligatorio.");
    }
    const {
      public: { GQL_HOST },
    } = useRuntimeConfig();
    if (!GQL_HOST) {
      throw new Error("GQL_HOST no está definido en la configuración");
    }
    const query = await import("~/queries/createForm.gql?raw").then(
      (m) => m.default
    );
    const response = await fetch(GQL_HOST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        query,
        variables: {
          createFormInput: {
            name: formBuilderStore.formName,
            fields: formBuilderStore.formElements.map((element) => {
              const field = {
                type: element.type,
                label: element.label || "",
                value: element.value || "",
                variableName: element.variableName || "",
                placeholder: element.placeholder || "",
                hint: element.hint || "",
                height: element.height ? String(element.height) : "auto",
                required: !!element.required,
                chapter: element.chapter || "General",
                question: element.question || "",
                questionNumber: element.questionNumber || "",
                consistencyCondition: element.consistencyCondition || "",
                inconsistencyMessage: element.inconsistencyMessage || "",
                errorType: element.errorType || "",
                description: element.description || "",
                requirementLevel: element.requirementLevel || "Optional",
                options:
                  element.options?.map((opt: any) =>
                    typeof opt === "string"
                      ? { value: opt, label: opt }
                      : { value: opt.value, label: opt.text || opt.value }
                  ) || [],
                disabled: !!element.disabled,
                readonly: !!element.readonly,
                name: element.name || "",
                specificType: element.specificType || "",
                color: element.color || "",
                rules: element.rules || [],
              };
              return field;
            }),
          },
        },
      }),
    });

    const data = await response.json();
    if (data.errors) {
      throw new Error(data.errors[0]?.message || "Error en la mutación");
    }

    formBuilderStore.initializeForm([]);
    formBuilderStore.formName = "";
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
