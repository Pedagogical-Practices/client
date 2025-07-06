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
      console.log('Attempting to update element with ID:', updatedElement.id);
      console.log('Data received for update:', JSON.parse(JSON.stringify(updatedElement)));

      const index = this.formElements.findIndex(
        (el) => el.id === updatedElement.id
      );

      if (index !== -1) {
        console.log('Found element at index:', index);
        console.log('State BEFORE update:', JSON.parse(JSON.stringify(this.formElements[index])));
        
        // Use Object.assign to merge properties into the existing object
        // This preserves the object reference, helping Vue's reactivity.
        Object.assign(this.formElements[index], updatedElement);
        
        console.log('State AFTER update:', JSON.parse(JSON.stringify(this.formElements[index])));
      } else {
        console.error('Update failed: Element with ID', updatedElement.id, 'not found in store.');
      }
    },
    setSelectedElement(elementId: string | null) {
      this.selectedElementId = elementId;
    },
    initializeForm(elements: FormElement[]) {
      this.formElements = elements;
      this.selectedElementId = null;
    },
    moveElementUp(elementId: string) {
      const index = this.formElements.findIndex((el) => el.id === elementId);
      if (index > 0) {
        const element = this.formElements[index];
        this.formElements.splice(index, 1);
        this.formElements.splice(index - 1, 0, element);
      }
    },
    moveElementDown(elementId: string) {
      const index = this.formElements.findIndex((el) => el.id === elementId);
      if (index !== -1 && index < this.formElements.length - 1) {
        const element = this.formElements[index];
        this.formElements.splice(index, 1);
        this.formElements.splice(index + 1, 0, element);
      }
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
