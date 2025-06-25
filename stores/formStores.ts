import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import type { FormElement } from "~/stores/formElementStore";

export interface Form {
  _id: string;
  name: string;
  fields: FormElement[];
  createdBy: {
    id: string;
    name?: string;
    email?: string;
  };
  createdAt: string;
}

interface FormState {
  forms: Form[];
  currentForm: Form | null;
  formName: string;
}

export const useFormStore = defineStore("form", {
  state: (): FormState => ({
    forms: [],
    currentForm: null,
    formName: "",
  }),
  actions: {
    async fetchForms() {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
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
  persist: true,
});
