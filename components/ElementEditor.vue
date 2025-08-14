<template>
  <v-dialog
    :model-value="!!selectedElement"
    @update:model-value="handleDialogClose"
    persistent
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
          >Edit: {{ editableElement.label || editableElement.type }}</span
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
          <v-tab value="metadata" :slim="true">Metadata</v-tab>
          <v-tab value="advanced" :slim="true">Advanced</v-tab>
        </v-tabs>
        <v-divider></v-divider>

        <v-window v-model="currentTab" class="pa-4 tab-content-window">
          <!-- General Tab -->
          <v-window-item value="general" class="tab-pane">
            <v-row dense>
              <v-col cols="12">
                <v-select
                  v-model="editableElement.type"
                  :items="elementTypes"
                  label="Component Type"
                  hint="Change the base type of the element."
                  persistent-hint
                  density="compact"
                  variant="filled"
                  @update:model-value="handleTypeChange"
                ></v-select>
              </v-col>

              <!-- Fields for Typography Element -->
              <template v-if="editableElement.type === 'TYPOGRAPHY'">
                <v-col cols="12">
                  <v-textarea
                    v-model="editableElement.text"
                    label="Content"
                    hint="The text to be displayed."
                    persistent-hint
                    density="compact"
                    variant="filled"
                    rows="3"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="editableElement.variant"
                    :items="typographyVariants"
                    label="Variant"
                    hint="Heading, Subtitle, Body, etc."
                    persistent-hint
                    density="compact"
                    variant="filled"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="editableElement.textAlign"
                    :items="textAlignments"
                    label="Text Alignment"
                    persistent-hint
                    density="compact"
                    variant="filled"
                    clearable
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="editableElement.fontWeight"
                    :items="fontWeights"
                    label="Font Weight"
                    persistent-hint
                    density="compact"
                    variant="filled"
                    clearable
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="editableElement.textTransform"
                    :items="textTransforms"
                    label="Text Transform"
                    persistent-hint
                    density="compact"
                    variant="filled"
                    clearable
                  ></v-select>
                </v-col>
                 <v-col cols="12" md="6">
                  <v-select
                    v-model="editableElement.textDecoration"
                    :items="textDecorations"
                    label="Text Decoration"
                    persistent-hint
                    density="compact"
                    variant="filled"
                    clearable
                  ></v-select>
                </v-col>
              </template>

              <!-- Fields for other Input Elements -->
              <template v-if="editableElement.type !== 'TYPOGRAPHY'">
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
                    v-model="editableElement.variableName"
                    label="Variable Name"
                    hint="Unique ID for data/logic (e.g., nombreVariable)."
                    persistent-hint
                    density="compact"
                    variant="filled"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editableElement.placeholder"
                    label="Placeholder"
                    hint="Placeholder text."
                    persistent-hint
                    density="compact"
                    variant="filled"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editableElement.hint"
                    label="Hint / Helper Text"
                    hint="Small text under input."
                    persistent-hint
                    density="compact"
                    variant="filled"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editableElement.value"
                    label="Default Value"
                    hint="Initial value."
                    persistent-hint
                    density="compact"
                    variant="filled"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" v-if="editableElement.type === 'TEXT'">
                  <v-select
                    v-model="editableElement.specificType"
                    :items="['text', 'number', 'email', 'password', 'tel', 'url', 'date']"
                    label="Input Type"
                    hint="HTML input type (for text fields)."
                    persistent-hint
                    density="compact"
                    variant="filled"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6" v-if="editableElement.type === 'TEXTAREA'">
                  <v-text-field
                    type="number"
                    v-model.number="editableElement.height"
                    label="Height (rows)"
                    hint="Number of rows for textarea."
                    persistent-hint
                    density="compact"
                    variant="filled"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" v-if="editableElement.type === 'BUTTON'">
                  <v-text-field
                    v-model="editableElement.color"
                    label="Button Color"
                    hint="e.g., primary, success, #FF0000"
                    persistent-hint
                    density="compact"
                    variant="filled"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  v-if="editableElement.type === FormFieldType.SELECT || editableElement.type === FormFieldType.AUTOCOMPLETE"
                >
                  <v-select
                    v-model="editableElement.dataSource"
                    :items="Object.values(DataSourceTypeEnum)"
                    label="Data Source"
                    hint="Source for dynamic options (e.g., institutions, teachers)."
                    persistent-hint
                    density="compact"
                    variant="filled"
                    clearable
                  ></v-select>
                </v-col>
              </template>
            </v-row>
          </v-window-item>

          <v-window-item value="behavior" class="tab-pane">
            <v-row dense>
              <v-col cols="12" sm="4">
                <v-switch
                  v-model="editableElement.required"
                  label="Required"
                  color="primary"
                  density="compact"
                  inset
                ></v-switch>
              </v-col>
              <v-col cols="12" sm="4">
                <v-switch
                  v-model="editableElement.disabled"
                  label="Disabled"
                  color="primary"
                  density="compact"
                  inset
                ></v-switch>
              </v-col>
              <v-col cols="12" sm="4">
                <v-switch
                  v-model="editableElement.readonly"
                  label="Read-only"
                  color="primary"
                  density="compact"
                  inset
                ></v-switch>
              </v-col>
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
              <template
                v-if="
                  editableElement.type === 'SELECT' ||
                  editableElement.type === 'RADIO_GROUP' ||
                  editableElement.type === 'CHECKBOX_GROUP'
                "
              >
                <v-col cols="12">
                  <v-textarea
                    v-model="selectItemsText"
                    :label="
                      editableElement.type === 'CHECKBOX_GROUP'
                        ? 'Checkbox Options (JSON format)'
                        : editableElement.type === 'SELECT'
                          ? 'Dropdown Options (one per line)'
                          : 'Radio Options (one per line)'
                    "
                    :hint="
                      editableElement.type === 'CHECKBOX_GROUP'
                        ? 'JSON array of objects with value and label.'
                        : editableElement.type === 'SELECT'
                          ? 'Format: value|label, one per line.'
                          : 'Format: value|label, one per line.'
                    "
                    persistent-hint
                    rows="5"
                    density="compact"
                    variant="filled"
                  ></v-textarea>
                </v-col>
              </template>
            </v-row>
          </v-window-item>

          <v-window-item value="metadata" class="tab-pane">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editableElement.chapter"
                  label="Chapter (capitulo)"
                  density="compact"
                  variant="filled"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editableElement.questionNumber"
                  label="Question Number (numeroPregunta)"
                  density="compact"
                  variant="filled"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editableElement.question"
                  label="Question Text (pregunta)"
                  rows="2"
                  density="compact"
                  variant="filled"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editableElement.description"
                  label="Description (descripcion)"
                  hint="Internal notes."
                  persistent-hint
                  rows="2"
                  density="compact"
                  variant="filled"
                ></v-textarea>
              </v-col>
              <!--v-col cols="12" md="6">
                <v-select
                  v-model="editableElement.requirementLevel"
                  :items="['Required', 'Optional', 'Conditional']"
                  label="Requirement Level (obligatoriedad)"
                  hint="Semantic requirement level."
                  persistent-hint
                  density="compact"
                  variant="filled"
                ></v-select>
              </v-col-->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editableElement.name"
                  label="HTML Name Attribute"
                  hint="For form submissions (name)."
                  persistent-hint
                  density="compact"
                  variant="filled"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-window-item>

          <v-window-item value="advanced" class="tab-pane">
            <v-row dense>
              <v-col cols="12">
                <v-textarea
                  v-model="editableElement.consistencyCondition"
                  label="Consistency Condition (condicionConsistencia)"
                  rows="2"
                  density="compact"
                  hint="Logic for consistency checks."
                  variant="filled"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editableElement.inconsistencyMessage"
                  label="Inconsistency Message (mensajeInconsistencia)"
                  rows="2"
                  density="compact"
                  hint="Message if check fails."
                  variant="filled"
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="editableElement.errorType"
                  :items="['Soft', 'Hard']"
                  label="Error Type (tipoError)"
                  hint="Severity of inconsistency."
                  persistent-hint
                  density="compact"
                  variant="filled"
                ></v-select>
              </v-col>
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
  <v-dialog v-model="showPreview" fullscreen>
    <v-card>
      <v-card-title
        class="d-flex justify-space-between align-center headline-bar"
      >
        <span class="text-h6 font-weight-medium">Form Preview</span>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="showPreview = false"
        ></v-btn>
      </v-card-title>
      <v-card-text>
        <FormViewer
          :formDefinition="{ fields: formElement.getFormElements() }"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, toRaw, reactive } from "vue";
import { useFormElementStore } from "~/stores/formElementStore";
import { useDataSourceStore } from "~/stores/dataSourceStore";
import FormViewer from "~/components/FormViewer.vue";
import { availableElements } from "./formElementDefinitions";
import { type FormField, FormFieldType, DataSourceType } from "~/types";

const DataSourceTypeEnum = DataSourceType;
//"~/components/formElementDefinitions";

const formElement = useFormElementStore();
const dataSourceStore = useDataSourceStore();

const selectedElement = computed(() => formElement.getSelectedElement);
const editableElement = ref<FormField | null>(null);
const currentTab = ref("general");
const showPreview = ref(false);

const selectItemsText = ref("");
const rulesText = ref("");

const typographyVariants = [
  'text-h1', 'text-h2', 'text-h3', 'text-h4', 'text-h5', 'text-h6',
  'text-subtitle-1', 'text-subtitle-2', 'text-body-1', 'text-body-2',
  'text-button', 'text-caption', 'text-overline'
];
const textAlignments = ['text-left', 'text-center', 'text-right', 'text-justify', 'text-start', 'text-end'];
const fontWeights = ['font-weight-black', 'font-weight-bold', 'font-weight-medium', 'font-weight-regular', 'font-weight-light', 'font-weight-thin'];
const textDecorations = ['text-decoration-none', 'text-decoration-overline', 'text-decoration-underline', 'text-decoration-line-through'];
const textTransforms = ['text-uppercase', 'text-lowercase', 'text-capitalize', 'text-none'];

const elementTypes = computed(() =>
  availableElements.map((el) => ({
    title: el.displayName,
    value: el.type,
  }))
);

watch(
  selectedElement,
  async (newVal) => {
    if (newVal) {
      editableElement.value = JSON.parse(JSON.stringify(newVal));
      if (typeof editableElement.value.dataSource !== "string") {
        editableElement.value.dataSource = String(
          editableElement.value.dataSource || ""
        );
      }
      rulesText.value = Array.isArray(editableElement.value?.rules)
        ? editableElement.value!.rules.join(",")
        : "";
      currentTab.value = "general";

      if (editableElement.value?.dataSource) {
        selectItemsText.value = await dataSourceStore.fetchFormattedOptions(
          editableElement.value.dataSource
        );
      } else if (
        editableElement.value.type === FormFieldType.CHECKBOX_GROUP ||
        editableElement.value.type === FormFieldType.RADIO_GROUP
      ) {
        selectItemsText.value = JSON.stringify(
          editableElement.value.options || [],
          null,
          2
        );
      } else if (Array.isArray(editableElement.value?.options)) {
        selectItemsText.value = editableElement.value.options
          .map((opt: any) => {
            if (typeof opt === "string") return opt;
            return `${opt.value}|${opt.label || opt.text}`;
          })
          .join("\n");
      } else {
        selectItemsText.value = "";
      }
    } else {
      editableElement.value = null;
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => editableElement.value?.dataSource,
  async (newDataSource) => {
    if (
      editableElement.value?.type === "SELECT" ||
      editableElement.value?.type === "AUTOCOMPLETE"
    ) {
      selectItemsText.value = newDataSource
        ? await dataSourceStore.fetchFormattedOptions(newDataSource)
        : "";
    }
  }
);

const handleTypeChange = (newType: string) => {
  if (!editableElement.value || editableElement.value.type === newType) return;

  const newElementDef = availableElements.find((el) => el.type === newType);
  if (!newElementDef) return;

  const oldElement = editableElement.value;
  const newDefaultConfig = JSON.parse(
    JSON.stringify(newElementDef.defaultConfig)
  );

  // Preserve common properties
  const preservedProps = {
    id: oldElement.id,
    label: oldElement.label,
    variableName: oldElement.variableName,
    hint: oldElement.hint,
    required: oldElement.required,
    disabled: oldElement.disabled,
    readonly: oldElement.readonly,
    rules: oldElement.rules,
    chapter: oldElement.chapter,
    question: oldElement.question,
    questionNumber: oldElement.questionNumber,
    description: oldElement.description,
  };

  // Create the new element state by merging defaults and preserved props
  editableElement.value = {
    ...newDefaultConfig,
    ...preservedProps,
    type: newType, // Ensure the new type is set
    // Ensure dataSource is preserved or initialized for select/dynamic-select types
    dataSource:
      newType === "SELECT" ||
      newType === "DYNAMIC-SLECT" ||
      newType === "AUTOCOMPLETE"
        ? oldElement.dataSource || ""
        : undefined,
  };

  // Reset specific text fields
  rulesText.value = Array.isArray(editableElement.value?.rules)
    ? editableElement.value?.rules.join(",")
    : "";
  selectItemsText.value = "";
};

const handleDialogClose = (value: boolean) => {
  if (!value) closeEditor();
};

const closeEditor = () => {
  formElement.setSelectedElement(null);
  editableElement.value = null;
};

const saveChanges = () => {
  if (!editableElement.value) return;

  // If a dataSource is selected, clear the manual options to avoid conflicts.
  if (editableElement.value.dataSource) {
    editableElement.value.options = [];
  } else if (
    editableElement.value.type === FormFieldType.CHECKBOX_GROUP ||
    editableElement.value.type === FormFieldType.RADIO_GROUP
  ) {
    try {
      editableElement.value.options = JSON.parse(selectItemsText.value);
    } catch (e) {
      console.error("Invalid JSON for options", e);
      // Optionally, show a snackbar error to the user
      return; // Prevent saving with invalid options
    }
  } else if (editableElement.value.type === "SELECT") {
    if (typeof selectItemsText.value === "string") {
      editableElement.value.options = selectItemsText.value
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line)
        .map((line) => {
          const parts = line.split("|");
          if (parts.length === 2)
            return { value: parts[0].trim(), label: parts[1].trim() };
          return { value: line, label: line };
        });
    }
  }

  editableElement.value.rules = rulesText.value
    .split(",")
    .map((r) => r.trim())
    .filter((r) => r);

  formElement.updateElement(JSON.parse(JSON.stringify(editableElement.value)));
  closeEditor(); // Close the dialog after saving
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
