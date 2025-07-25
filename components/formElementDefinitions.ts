export enum FormFieldType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  SELECT = 'SELECT',
  DATE = 'DATE',
  MAP = 'MAP',
  FILE_UPLOAD = 'FILE_UPLOAD',
}

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  options?: Record<string, any>;
  rules?: string[];
  defaultValue?: string;
}

export interface AvailableElementDefinition {
  type: FormFieldType;
  displayName: string;
  icon: string;
  defaultConfig: Omit<FormField, "name">;
}

export const availableElements: AvailableElementDefinition[] = [
  {
    type: FormFieldType.TEXT,
    displayName: "Text Input",
    icon: "mdi-form-textbox",
    defaultConfig: {
      label: "Text Input",
      type: FormFieldType.TEXT,
      options: null,
      rules: [],
    },
  },
  {
    type: FormFieldType.TEXTAREA,
    displayName: "Text Area",
    icon: "mdi-form-textarea",
    defaultConfig: {
      label: "Text Area",
      type: FormFieldType.TEXTAREA,
      options: null,
      rules: [],
    },
  },
  {
    type: FormFieldType.SELECT,
    displayName: "Dropdown Select",
    icon: "mdi-form-dropdown",
    defaultConfig: {
      label: "Select Option",
      type: FormFieldType.SELECT,
      options: { items: ["Option 1", "Option 2", "Option 3"] },
      rules: [],
    },
  },
  {
    type: FormFieldType.DATE,
    displayName: "Date Picker",
    icon: "mdi-calendar",
    defaultConfig: {
      label: "Select Date",
      type: FormFieldType.DATE,
      options: null,
      rules: [],
    },
  },
  {
    type: FormFieldType.MAP,
    displayName: "Map Input",
    icon: "mdi-map",
    defaultConfig: {
      label: "Location",
      type: FormFieldType.MAP,
      options: null,
      rules: [],
    },
  },
  {
    type: FormFieldType.FILE_UPLOAD,
    displayName: "File Upload",
    icon: "mdi-file-upload",
    defaultConfig: {
      label: "Upload File",
      type: FormFieldType.FILE_UPLOAD,
      options: null,
      rules: [],
    },
  },
];
