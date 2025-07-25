<template>
  <v-dialog
    :model-value="!!selectedElement"
    @update:model-value="handleDialogClose"
    persistent
    max-width="800px"
    scrollable
  >
    <v-card
      v-if="selectedElement && editableElement"
      class="element-editor-card"
    >
      <v-card-title
        class="d-flex justify-space-between align-center headline-bar"
      >
        <span class="text-h6 font-weight-medium"
          >Edit: {{ editableElement.label || editableElement.name }}</span
        >

        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeEditor"
          title="Close editor"
        ></v-btn>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text class="pa-0">
        <v-tabs v-model="currentTab" color="primary" grow class="editor-tabs">
          <v-tab value="general" :slim="true">General</v-tab>
          <v-tab value="behavior" :slim="true">Behavior & Validation</v-tab>
        </v-tabs>
        <v-divider></v-divider>

        <v-window v-model="currentTab" class="pa-4 tab-content-window">
          <v-window-item value="general" class="tab-pane">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-select
                  v-model="editableElement.type"
                  :items="elementTypes"
                  label="Component Type"
                  hint="Change the base type of the element."
                  persistent-hint
                  density="compact"
                  variant="filled"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editableElement.label"
                  label="Label"
                  hint="Visible label for the field."
                  persistent-hint
                  density="compact"
                  variant="filled"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editableElement.name"
                  label="Field Name (Unique)"
                  hint="Unique programmatic name for the field."
                  persistent-hint
                  density="compact"
                  variant="filled"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-window-item>

          <v-window-item value="behavior" class="tab-pane">
            <v-row dense>
              <v-col cols="12">
                <v-textarea
                  v-model="rulesText"
                  label="Validation Rules (comma-separated)"
                  hint="e.g., required,email,minLength:5. For Vuetify, these map to functions."
                  persistent-hint
                  rows="2"
                  density="compact"
                  variant="filled"
                ></v-textarea>
              </v-col>
              <template v-if="editableElement.type === FormFieldType.SELECT">
                <v-col cols="12">
                  <v-textarea
                    v-model="optionsText"
                    label="Options (JSON string)"
                    hint="Enter options as a JSON string, e.g., {'items': ['Option 1', 'Option 2']}"
                    persistent-hint
                    rows="3"
                    density="compact"
                    variant="filled"
                  ></v-textarea>
                </v-col>
              </template>
            </v-row>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-3 editor-actions">
        <v-btn color="grey-darken-1" variant="text" @click="closeEditor"
          >Cancel</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="elevated"
          @click="saveChanges"
          prepend-icon="mdi-content-save"
          >Save Changes</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, toRaw, reactive } from "vue";
import { useFormElementStore } from "~/stores/formElementStore";
import { availableElements } from "./formElementDefinitions";
import { type FormField, FormFieldType } from "~/types";

const formElement = useFormElementStore();

const selectedElement = computed(() => {
  const element = formElement.getSelectedElement;
  console.log("ElementEditor: selectedElement computed value:", element);
  return element;
});
const editableElement = ref<FormField | null>(null);
const currentTab = ref("general");

const optionsText = ref("");
const rulesText = ref("");

const elementTypes = computed(() =>
  availableElements.map((el) => ({
    title: el.displayName,
    value: el.type,
  }))
);

watch(
  selectedElement,
  (newVal) => {
    if (newVal) {
      editableElement.value = reactive(toRaw(newVal));
      rulesText.value = Array.isArray(editableElement.value?.rules)
        ? editableElement.value!.rules.join(",")
        : "";
      optionsText.value = editableElement.value?.options
        ? JSON.stringify(editableElement.value.options, null, 2)
        : "";
      currentTab.value = "general";
    } else {
      editableElement.value = null;
    }
  },
  { deep: true, immediate: true }
);

const handleDialogClose = (value: boolean) => {
  if (!value) closeEditor();
};

const closeEditor = () => {
  formElement.setSelectedElement(null);
  editableElement.value = null;
};

const saveChanges = () => {
  if (!editableElement.value) return;

  editableElement.value.rules = rulesText.value
    .split(",")
    .map((r) => r.trim())
    .filter((r) => r);

  if (optionsText.value) {
    try {
      editableElement.value.options = JSON.parse(optionsText.value);
    } catch (e) {
      console.error("Error parsing options JSON:", e);
      // Handle error, maybe show a user-friendly message
      return;
    }
  } else {
    editableElement.value.options = undefined;
  }

  formElement.updateElement(JSON.parse(JSON.stringify(editableElement.value)));
};
</script>

<style scoped>
.element-editor-card {
  border-radius: 8px; /* More modern rounded corners */
}
.headline-bar {
  background-color: #f5f5f5; /* Light grey for title bar */
  padding: 12px 16px;
}
.editor-tabs {
  border-bottom: 1px solid #e0e0e0; /* Separator for tabs */
}
.tab-content-window {
  /* The pa-4 class is already applied to the v-window */
}
.tab-pane {
  /* Each v-window-item */
  padding-top: 12px; /* Add some top padding inside tab panes */
}

.v-card-text {
  /* This is the main scrollable area */
  /* pa-0 was set, so children need padding */
}
.editor-actions {
  background-color: #f9f9f9; /* Light background for actions */
  border-top: 1px solid #e0e0e0;
}

/* Ensure switches have enough space */
.v-switch {
  margin-top: 4px;
  margin-bottom: 4px;
}
</style>
