import type { FormField } from "./formField"; // Asumiendo que tienes un tipo FormField

export interface Form {
  _id: string;
  name: string;
  fields: FormField[];
  createdBy: string; // O User si lo populaste
  createdAt: string;
}

export interface FormElement {
  id: string;
  type: string;
  label: string;
  value?: any;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  name?: string;
  specificType?: string;
  height?: string | number;
  width?: string | number;
  color?: string;
  options?: string[] | { text: string; value: any }[];
  rules?: string[];
  variableName?: string;
  chapter?: string;
  question?: string;
  questionNumber?: string;
  consistencyCondition?: string;
  inconsistencyMessage?: string;
  errorType?: "Soft" | "Hard" | string;
  description?: string;
  requirementLevel?: "Required" | "Optional" | "Conditional" | string;
  multiple?: boolean;
  dataSource?: string;
}

interface FormElementState {
  formElements: FormElement[];
  selectedElementId: string | null;
}
