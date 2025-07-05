import { defineStore } from "pinia";
import type { FormElement } from "~/types/form";

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
      this.formElements = this.formElements.filter(
        (el: any) => el.id !== elementId
      );
      if (this.selectedElementId === elementId) {
        this.selectedElementId = null;
      }
    },
    updateElement(updatedElement: FormElement) {
      const index = this.formElements.findIndex(
        (el: any) => el.id === updatedElement.id
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
        state.formElements.find((el: any) => el.id === elementId),
    getFormElements: (state): FormElement[] => state.formElements,
    getSelectedElement: (state): FormElement | undefined =>
      state.selectedElementId
        ? state.formElements.find(
            (el: any) => el.id === state.selectedElementId
          )
        : undefined,
  },
  persist: true,
});
