import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { FormField } from "~/types"; // Asegúrate de que esta ruta sea correcta

// Definición local de FormField
/*export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  options?: Record<string, any>;
  rules?: string[];
  defaultValue?: string;
}*/

interface FormElementState {
  formElements: FormField[];
  selectedElementName: string | null;
}

export const useFormElementStore = defineStore("formElement", () => {
  // State
  const formElements = ref<FormField[]>([]);
  const selectedElementName = ref<string | null>(null);

  // Actions
  const addElement = (element: FormField) => {
    formElements.value.push(element);
  };

  const removeElement = (elementName: string) => {
    formElements.value = formElements.value.filter(
      (el) => el.name !== elementName
    );
    if (selectedElementName.value === elementName) {
      selectedElementName.value = null;
    }
  };

  const updateElement = (updatedElement: FormField) => {
    const index = formElements.value.findIndex(
      (el) => el.name === updatedElement.name
    );

    if (index !== -1) {
      Object.assign(formElements.value[index], updatedElement);
    } else {
      console.error(
        "Update failed: Element with name",
        updatedElement.name,
        "not found in store."
      );
    }
  };

  const setSelectedElement = (elementName: string | null) => {
    console.log("formElementStore: Setting selected element to:", elementName);
    selectedElementName.value = elementName;
  };

  const initializeForm = (elements: FormField[]) => {
    formElements.value = elements;
    selectedElementName.value = null;
  };

  const moveElementUp = (elementName: string) => {
    const index = formElements.value.findIndex((el) => el.name === elementName);
    if (index > 0) {
      const element = formElements.value[index];
      formElements.value.splice(index, 1);
      formElements.value.splice(index - 1, 0, element);
    }
  };

  const moveElementDown = (elementName: string) => {
    const index = formElements.value.findIndex((el) => el.name === elementName);
    if (index !== -1 && index < formElements.value.length - 1) {
      const element = formElements.value[index];
      formElements.value.splice(index, 1);
      formElements.value.splice(index + 1, 0, element);
    }
  };

  // Getters
  const getElement = computed(
    () =>
      (elementName: string): FormField | undefined => {
        return formElements.value.find((el) => el.name === elementName);
      }
  );

  const getFormElements = computed(() => formElements.value);

  const getSelectedElement = computed(() => {
    return selectedElementName.value
      ? formElements.value.find((el) => el.name === selectedElementName.value)
      : undefined;
  });

  return {
    formElements,
    selectedElementName,
    addElement,
    removeElement,
    updateElement,
    setSelectedElement,
    initializeForm,
    moveElementUp,
    moveElementDown,
    getElement,
    getFormElements,
    getSelectedElement,
  };
});
