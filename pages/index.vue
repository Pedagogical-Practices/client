<!-- pages/index.vue -->
<template>
  <v-app>
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="pa-4" elevation="2">
            <h2>Caja de Herramientas</h2>
            <v-list>
              <v-list-item
                v-for="(item, index) in formStore.availableComponents"
                :key="index"
                draggable="true"
                @dragstart="startDrag($event, item.type)"
                class="mb-2"
              >
                <v-btn
                  :prepend-icon="item.icon"
                  block
                  @click="formStore.addComponent(item.type)"
                >
                  {{ item.type.replace("v-", "") }}
                </v-btn>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="12" md="8">
          <v-card class="pa-4" elevation="2">
            <h2>Vista Previa del Formulario</h2>
            <v-container
              @dragover.prevent
              @drop="drop"
              class="drop-zone"
              :style="{ minHeight: '300px', border: '2px dashed #ccc' }"
            >
              <v-form>
                <v-row
                  v-for="(component, index) in formStore.components"
                  :key="index"
                  class="mb-2"
                >
                  <v-col cols="10">
                    <component
                      :is="component.type"
                      v-model="component.value"
                      :label="component.label"
                      :placeholder="component.placeholder"
                      :hint="component.hint"
                      :height="component.height"
                      :required="component.required"
                      :rules="
                        component.required
                          ? [(v) => !!v || 'Este campo es requerido']
                          : []
                      "
                      persistent-hint
                    />
                  </v-col>
                  <v-col cols="2">
                    <v-btn icon @click="openEditDialog(index)"
                      ><v-icon>mdi-pencil</v-icon></v-btn
                    >
                    <v-btn
                      icon
                      color="error"
                      @click="formStore.removeComponent(index)"
                      ><v-icon>mdi-delete</v-icon></v-btn
                    >
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
            <v-card-text>
              <h3>JSON del Formulario</h3>
              <pre>{{ JSON.stringify(formStore.components, null, 2) }}</pre>
            </v-card-text>
            <v-btn color="primary" @click="saveFormToBackend"
              >Guardar Formulario</v-btn
            >
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>Editar Componente</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field v-model="editForm.label" label="Etiqueta" />
              <v-text-field
                v-model="editForm.value"
                label="Valor por Defecto"
              />
              <v-text-field
                v-model="editForm.variableName"
                label="Nombre de Variable"
              />
              <v-text-field
                v-model="editForm.placeholder"
                label="Placeholder"
              />
              <v-text-field v-model="editForm.hint" label="Pista" />
              <v-text-field v-model="editForm.height" label="Altura" />
              <v-checkbox v-model="editForm.required" label="Requerido" />
              <v-text-field v-model="editForm.chapter" label="Capítulo" />
              <v-text-field v-model="editForm.question" label="Pregunta" />
              <v-text-field
                v-model="editForm.questionNumber"
                label="Número de Pregunta"
              />
              <v-text-field
                v-model="editForm.consistencyCondition"
                label="Condición de Consistencia"
              />
              <v-text-field
                v-model="editForm.inconsistencyMessage"
                label="Mensaje de Inconsistencia"
              />
              <v-text-field
                v-model="editForm.errorType"
                label="Tipo de Error"
              />
              <v-textarea v-model="editForm.description" label="Descripción" />
              <v-select
                v-model="editForm.requirementLevel"
                :items="['Required', 'Optional']"
                label="Nivel de Requerimiento"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="saveEdit">Guardar</v-btn>
            <v-btn @click="dialog = false">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useFormStore } from "~/stores/form";

const formStore = useFormStore();
const dialog = ref(false);
const editIndex = ref(null);
const editForm = ref({});

const saveFormToBackend = async () => {
  try {
    const query = await import("~/queries/form.gql?raw").then((m) => m.default);
    const response = await $fetch("http://127.0.0.1:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-apollo-operation-name": "CreateForm",
      },
      body: JSON.stringify({
        query,
        variables: {
          createFormInput: {
            name: "Nuevo Formulario",
            fields: formStore.components.map((component) => ({
              type: component.type,
              label: component.label,
              value: component.value || "",
              variableName: component.variableName,
              placeholder: component.placeholder || "",
              hint: component.hint || "",
              height: component.height || "auto",
              required: !!component.required,
              chapter: component.chapter || "General",
              question: component.question || "",
              questionNumber: component.questionNumber || "",
              consistencyCondition: component.consistencyCondition || "",
              inconsistencyMessage: component.inconsistencyMessage || "",
              errorType: component.errorType || "",
              description: component.description || "",
              requirementLevel: component.requirementLevel || "Optional",
            })),
          },
        },
      }),
    });

    if (response.errors) {
      throw new Error(response.errors[0]?.message || "Error en la mutación");
    }

    alert("Formulario guardado exitosamente!");
    formStore.components = []; // Opcional: Limpiar formulario
  } catch (error) {
    console.error("Error al guardar:", error);
    alert(`Error: ${error.message}`);
  }
};

const startDrag = (event, type) => {
  event.dataTransfer.setData("componentType", type);
};

const drop = (event) => {
  const componentType = event.dataTransfer.getData("componentType");
  if (componentType) formStore.addComponent(componentType);
};

const openEditDialog = (index) => {
  editIndex.value = index;
  editForm.value = { ...formStore.components[index] };
  dialog.value = true;
};

const saveEdit = () => {
  formStore.updateComponent(editIndex.value, editForm.value);
  dialog.value = false;
};
</script>

<style scoped>
.drop-zone {
  background-color: #f5f5f5;
  padding: 16px;
}
</style>
