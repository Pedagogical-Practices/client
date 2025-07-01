import { defineStore } from "pinia";

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

export const useFormElementStore = defineStore("formElement", {
  state: (): FormElementState => ({
    formElements: [],
    selectedElementId: null,
  }),
  actions: {
    addElement(element: FormElement) {
      if (!element.id) {
        element.id =
          Date.now().toString() + Math.random().toString(36).substring(2, 9);
      }
      this.formElements.push(element);
    },
    removeElement(elementId: string) {
      this.formElements = this.formElements.filter((el) => el.id !== elementId);
      if (this.selectedElementId === elementId) {
        this.selectedElementId = null;
      }
    },
    updateElement(updatedElement: FormElement) {
      const index = this.formElements.findIndex(
        (el) => el.id === updatedElement.id
      );
      if (index !== -1) {
        this.formElements[index] = updatedElement;
      }
    },
    setSelectedElement(elementId: string | null) {
      this.selectedElementId = elementId;
    },
    initializeForm(elements: FormElement[]) {
      this.formElements = elements;
      this.selectedElementId = null;
    },
  },
  getters: {
    getElement:
      (state) =>
      (elementId: string): FormElement | undefined =>
        state.formElements.find((el) => el.id === elementId),
    getFormElements: (state): FormElement[] => state.formElements,
    getSelectedElement: (state): FormElement | undefined =>
      state.selectedElementId
        ? state.formElements.find((el) => el.id === state.selectedElementId)
        : undefined,
  },
  persist: true,
});
