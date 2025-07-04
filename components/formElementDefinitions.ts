import type { FormElement } from "~/stores/formElementStore";

export interface AvailableElementDefinition {
  type: string;
  displayName: string;
  icon: string;
  defaultConfig: Omit<FormElement, "id">;
}

export const availableElements: AvailableElementDefinition[] = [
  {
    type: "text",
    displayName: "Text Input",
    icon: "mdi-form-textbox",
    defaultConfig: {
      type: "text",
      label: "Text Input",
      value: "",
      placeholder: "Enter text...",
      specificType: "text",
      variableName: "textInputVar",
      hint: "",
      required: false,
      disabled: false,
      readonly: false,
      name: "",
      height: undefined,
      width: undefined,
      rules: [],
      chapter: "",
      question: "",
      questionNumber: "",
      consistencyCondition: "",
      inconsistencyMessage: "",
      errorType: "Soft",
      description: "",
      requirementLevel: "Optional",
    },
  },
  {
    type: "textarea",
    displayName: "Text Area",
    icon: "mdi-form-textarea",
    defaultConfig: {
      type: "textarea",
      label: "Text Area",
      value: "",
      placeholder: "Enter multi-line text...",
      height: 3,
      variableName: "textAreaVar",
      hint: "",
      required: false,
      disabled: false,
      readonly: false,
      name: "",
      width: undefined,
      rules: [],
      chapter: "",
      question: "",
      questionNumber: "",
      consistencyCondition: "",
      inconsistencyMessage: "",
      errorType: "Soft",
      description: "",
      requirementLevel: "Optional",
    },
  },
  {
    type: "checkbox",
    displayName: "Checkbox",
    icon: "mdi-checkbox-marked-outline",
    defaultConfig: {
      type: "checkbox",
      label: "Checkbox Label",
      value: "false",
      variableName: "checkboxVar",
      hint: "",
      required: false,
      disabled: false,
      readonly: false,
      name: "",
      height: undefined,
      width: undefined,
      rules: [],
      chapter: "",
      question: "",
      questionNumber: "",
      consistencyCondition: "",
      inconsistencyMessage: "",
      errorType: "Soft",
      description: "",
      requirementLevel: "Optional",
    },
  },
  {
    type: "select",
    displayName: "Dropdown Select",
    icon: "mdi-form-dropdown",
    defaultConfig: {
      type: "select",
      label: "Select Option",
      value: "",
      placeholder: "Choose an option",
      options: ["Option 1", "Option 2", "Option 3"],
      variableName: "selectVar",
      hint: "",
      required: false,
      disabled: false,
      readonly: false,
      name: "",
      height: undefined,
      width: undefined,
      rules: [],
      chapter: "",
      question: "",
      questionNumber: "",
      consistencyCondition: "",
      inconsistencyMessage: "",
      errorType: "Soft",
      description: "",
      requirementLevel: "Optional",
    },
  },
  {
    type: "button",
    displayName: "Button",
    icon: "mdi-gesture-tap-button",
    defaultConfig: {
      type: "button",
      label: "Click Me",
      value: "",
      color: "primary",
      specificType: "button",
      variableName: "buttonVar",
      description: "A clickable button.",
      hint: undefined,
      required: undefined,
      name: undefined,
      height: undefined,
      width: undefined,
      rules: undefined,
      chapter: undefined,
      question: undefined,
      questionNumber: undefined,
      consistencyCondition: undefined,
      inconsistencyMessage: undefined,
      errorType: undefined,
      requirementLevel: undefined,
      options: undefined,
      disabled: false,
      readonly: false,
    },
  },
  {
    type: "radio-group",
    displayName: "Radio Group",
    icon: "mdi-radiomarkers",
    defaultConfig: {
      type: "radio-group",
      label: "Choose an option",
      value: "",
      options: [
        { text: "Option A", value: "A" },
        { text: "Option B", value: "B" },
      ],
      variableName: "radioGroupVar",
      rules: [],
      hint: "",
      required: false,
      disabled: false,
      readonly: false,
      name: "",
      height: undefined,
      width: undefined,
      chapter: "",
      question: "",
      questionNumber: "",
      consistencyCondition: "",
      inconsistencyMessage: "",
      errorType: "Soft",
      description: "",
      requirementLevel: "Optional",
    },
  },
  {
    type: "date-picker",
    displayName: "Date Picker",
    icon: "mdi-calendar",
    defaultConfig: {
      type: "date-picker",
      label: "Select Date",
      value: "",
      placeholder: "YYYY-MM-DD",
      variableName: "datePickerVar",
      hint: "",
      required: false,
      disabled: false,
      readonly: false,
      name: "",
      height: undefined,
      width: undefined,
      rules: [],
      chapter: "",
      question: "",
      questionNumber: "",
      consistencyCondition: "",
      inconsistencyMessage: "",
      errorType: "Soft",
      description: "",
      requirementLevel: "Optional",
    },
  },
  {
    type: "institution-select",
    displayName: "Selección de Institución",
    icon: "mdi-bank",
    defaultConfig: {
      type: "institution-select",
      label: "Seleccionar Institución",
      value: "", // Will store the selected institution's ID
      variableName: "institutionId",
      hint: "Selecciona una institución de la lista.",
      required: false,
      disabled: false,
      readonly: false,
      name: "",
      height: undefined,
      width: undefined,
      rules: [],
      chapter: "",
      question: "",
      questionNumber: "",
      consistencyCondition: "",
      inconsistencyMessage: "",
      errorType: "Soft",
      description: "",
      requirementLevel: "Optional",
      specificType: "institution", // To indicate it's for institutions
    },
  },
  {
    type: "dynamic-select",
    displayName: "Dynamic Select",
    icon: "mdi-form-select",
    defaultConfig: {
      type: "dynamic-select",
      label: "Dynamic Select",
      value: "",
      placeholder: "Choose an option",
      variableName: "dynamicSelectVar",
      hint: "",
      required: false,
      disabled: false,
      readonly: false,
      name: "",
      height: undefined,
      width: undefined,
      rules: [],
      chapter: "",
      question: "",
      questionNumber: "",
      consistencyCondition: "",
      inconsistencyMessage: "",
      errorType: "Soft",
      description: "",
      requirementLevel: "Optional",
      dataSource: "",
      options: [],
    },
  },
];
