export interface Option {
  label: string;
  value: string;
}

export interface FormField {
  type: string;
  label?: string;
  value?: string;
  variableName?: string;
  placeholder?: string;
  hint?: string;
  height?: string;
  required?: boolean;
  chapter?: string;
  question?: string;
  questionNumber?: string;
  consistencyCondition?: string;
  inconsistencyMessage?: string;
  errorType?: string;
  description?: string;
  requirementLevel?: string;
  options?: Option[];
  disabled?: boolean;
  readonly?: boolean;
  name?: string;
  specificType?: string;
  color?: string;
  rules?: string[];
  multiple?: boolean;
}