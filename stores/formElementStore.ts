import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { FormFieldType, type FormField } from "~/types";

interface FormElementState {
  formElements: FormField[];
  selectedElementName: string | null;
}

// Helper function to sanitize form fields
const sanitizeFields = (fields: FormField[]): FormField[] => {
  return fields.map((field) => {
    if (
      (field.type === FormFieldType.CHECKBOX_GROUP ||
        field.type === FormFieldType.RADIO_GROUP) &&
      (field.value === null || field.value === undefined)
    ) {
      return {
        ...field,
        value: {},
      };
    }
    return field;
  });
};

const sanitizeField = (field: FormField): FormField => {
  if (
    (field.type === FormFieldType.CHECKBOX_GROUP ||
      field.type === FormFieldType.RADIO_GROUP) &&
    (field.value === null || field.value === undefined)
  ) {
    return {
      ...field,
      value: {},
    };
  }
  return field;
};

export const useFormElementStore = defineStore("formElement", () => {
  // State
  const formElements = ref<FormField[]>([]);
  const selectedElementName = ref<string | null>(null);

  // Actions
  const addElement = (element: FormField) => {
    formElements.value.push(sanitizeField(element));
  };

  const chargeFieldsOnForm = (fields: FormField[]) => {
    formElements.value = sanitizeFields(fields);
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
    const sanitizedElement = sanitizeField(updatedElement);
    const index = formElements.value.findIndex(
      (el) => el.name === sanitizedElement.name
    );

    if (index !== -1) {
      // Create a new array with the updated element to avoid reactivity issues
      const newFormElements = [...formElements.value];
      newFormElements[index] = sanitizedElement;
      formElements.value = newFormElements;
    } else {
      console.error(
        "Update failed: Element with name",
        sanitizedElement.name,
        "not found in store."
      );
    }
  };

  const setSelectedElement = (elementName: string | null) => {
    selectedElementName.value = elementName;
  };

  const initializeForm = (elements: FormField[]) => {
    formElements.value = sanitizeFields(elements);
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
    chargeFieldsOnForm,
    moveElementUp,
    moveElementDown,
    getElement,
    getFormElements,
    getSelectedElement,
  };
});
