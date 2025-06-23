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
}

export interface Form {
  _id: string;
  name: string;
  fields: FormElement[];
  createdBy: { name: string; email: string };
  createdAt: string;
}

export interface FormBuilderState {
  formElements: FormElement[];
  selectedElementId: string | null;
  formName: string;
  forms: Form[];
  currentForm: Form | null;
}

export const useFormBuilderStore = defineStore("formBuilder", {
  state: (): FormBuilderState => ({
    formElements: [],
    selectedElementId: null,
    formName: "",
    forms: [],
    currentForm: null,
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
    async fetchForms() {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        if (!GQL_HOST) {
          throw new Error("GQL_HOST no está definido en la configuración");
        }
        const query = await import("~/queries/forms.gql?raw").then(
          (m) => m.default
        );
        const response = await fetch(GQL_HOST, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuthStore().token}`,
          },
          body: JSON.stringify({ query }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0]?.message || "Error fetching forms");
        }
        this.forms = data.data.forms;
      } catch (error: any) {
        console.error("Error fetching forms:", error);
      }
    },
    async fetchForm(id: string) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        if (!GQL_HOST) {
          throw new Error("GQL_HOST no está definido en la configuración");
        }
        const query = await import("~/queries/form.gql?raw").then(
          (m) => m.default
        );
        const response = await fetch(GQL_HOST, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuthStore().token}`,
          },
          body: JSON.stringify({
            query,
            variables: { id },
          }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0]?.message || "Error fetching form");
        }
        this.currentForm = data.data.form;
      } catch (error: any) {
        console.error("Error fetching form:", error);
      }
    },
  },
  getters: {
    getElement:
      (state) =>
      (elementId: string): FormElement | undefined => {
        return state.formElements.find((el) => el.id === elementId);
      },
    getFormElements: (state): FormElement[] => {
      return state.formElements;
    },
    getSelectedElement: (state): FormElement | undefined => {
      if (state.selectedElementId) {
        return state.formElements.find(
          (el) => el.id === state.selectedElementId
        );
      }
      return undefined;
    },
  },
  persist: true,
});
