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
    async fetchFormById(id: string) {
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
        const form = data.data.form;
        this.formName = form.name;
        const formElementStore = useFormElementStore();
        formElementStore.initializeForm(form.fields);
      } catch (error: any) {
        console.error("Error fetching form by id:", error);
        throw error;
      }
    },
  async submitForm(practiceId: string, formId: string, formData: Record<string, any>) {
      try {
        const { public: { GQL_HOST } } = useRuntimeConfig();
        const authStore = useAuthStore();
        const practiceStore = usePracticeStore();

        if (!practiceStore.currentPractice?.protocol?._id) {
          throw new Error('Protocol ID not found for current practice.');
        }
        const protocolId = practiceStore.currentPractice.protocol._id;

        // Paso 1: Crear la Submission
        const submitProtocolMutation = await import('~/queries/submitProtocol.gql?raw').then(m => m.default);
        const submitResponse = await fetch(GQL_HOST, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify({
            query: submitProtocolMutation,
            variables: {
              createSubmissionInput: {
                formId,
                protocolId,
                data: formData,
              },
            },
          }),
        });
        const submitData = await submitResponse.json();

        if (submitData.errors) {
          throw new Error(submitData.errors[0]?.message || 'Error submitting form data');
        }
        const submissionId = submitData.data.submitProtocol._id;

        // Paso 2: Registrar la Submission en la Practice
        const registerFormSubmissionMutation = await import('~/queries/registerFormSubmission.gql?raw').then(m => m.default);
        const registerResponse = await fetch(GQL_HOST, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify({
            query: registerFormSubmissionMutation,
            variables: {
              formId,
              practiceId,
              submissionId,
            },
          }),
        });
        const registerData = await registerResponse.json();

        if (registerData.errors) {
          throw new Error(registerData.errors[0]?.message || 'Error registering form submission with practice');
        }

        // Opcional: Actualizar la práctica en la store si es necesario
        // practiceStore.currentPractice = registerData.data.registerFormSubmission;

        console.log('Formulario guardado y registrado exitosamente.');
      } catch (error: any) {
        console.error('Error al guardar el formulario:', error);
        throw error; // Re-lanzar el error para que la UI pueda manejarlo
      }
    },
  },
  persist: true,
});
