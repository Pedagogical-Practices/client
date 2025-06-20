// stores/form.js

import { defineStore } from "pinia";
import { ref } from "vue";

interface Component {
  type: string;
  label: string;
  value: string;
  placeholder: string;
  hint: string;
  height: string;
  required: boolean;
  chapter: string;
  question: string;
  questionNumber: string;
  consistencyCondition: string;
  inconsistencyMessage: string;
  errorType: string;
  description: string;
  requirementLevel: string;
  variableName: string;
}

export const useFormStore = defineStore(
  "form",
  () => {
    const components = ref<Component[]>([]);

    const availableComponents = ref([
      { type: "v-text-field", icon: "mdi-text" },
      { type: "v-select", icon: "mdi-menu-down" },
      { type: "v-checkbox", icon: "mdi-checkbox-marked" },
      { type: "v-radio-group", icon: "mdi-radiobox-marked" },
      { type: "v-textarea", icon: "mdi-text-long" },
      { type: "v-switch", icon: "mdi-toggle-switch" },
      { type: "v-slider", icon: "mdi-tune" },
      { type: "v-date-picker", icon: "mdi-calendar" },
      { type: "v-time-picker", icon: "mdi-clock" },
      { type: "v-file-input", icon: "mdi-file-upload" },
    ]);

    const addComponent = (componentType: string) => {
      const newComponent: Component = {
        type: componentType,
        label: `New ${componentType.replace("v-", "")}`,
        value: "",
        variableName: `field_${components.value.length + 1}`,
        placeholder: "",
        hint: "",
        height: "auto",
        required: false,
        chapter: "General",
        question: `Question ${components.value.length + 1}`,
        questionNumber: `${components.value.length + 1}.1`,
        consistencyCondition: "",
        inconsistencyMessage: "",
        errorType: "",
        description: "",
        requirementLevel: "Optional",
      };

      components.value.push(newComponent);
    };

    const removeComponent = (index: number) => {
      components.value.splice(index, 1);
    };

    const updateComponent = (
      index: number,
      updatedProps: Partial<Component>
    ) => {
      components.value[index] = { ...components.value[index], ...updatedProps };
    };

    return {
      components,
      availableComponents,
      addComponent,
      removeComponent,
      updateComponent,
    };
  },
  {
    persist: true,
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFormStore, import.meta.hot));
}
