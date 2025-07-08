import { defineStore } from "pinia";
import type { Form } from "~/types/form";
import { useFormElementStore } from "~/stores/formElementStore";
import { usePracticeStore } from "~/stores/practiceStore";
import { useApolloClient } from '#imports';

// Import GQL documents
import FormsQuery from "~/queries/forms.gql";
import FormQuery from "~/queries/form.gql";
import SubmitProtocolMutation from '~/queries/submitProtocol.gql';
import RegisterFormSubmissionMutation from '~/queries/registerFormSubmission.gql';
import RemoveFormMutation from '~/queries/removeForm.gql';

interface FormState {
  forms: Form[];
  currentForm: Form | null;
  formName: string;
  editingFormId: string | null;
}

export const useFormStore = defineStore("form", {
  state: (): FormState => ({
    forms: [],
    currentForm: null,
    formName: "",
    editingFormId: null,
  }),
  actions: {
    async fetchForms() {
      const { client } = useApolloClient();
      try {
        const { data } = await client.query({ query: FormsQuery });
        if (data?.forms) {
          this.forms = data.forms;
        }
      } catch (error: any) {
        console.error("Error fetching forms:", error);
      }
    },

    async fetchForm(id: string) {
      const { client } = useApolloClient();
      try {
        const { data } = await client.query({ query: FormQuery, variables: { id } });
        if (data?.form) {
          this.currentForm = data.form;
        }
      } catch (error: any) {
        console.error("Error fetching form:", error);
      }
    },

    async fetchFormById(id: string) {
      const { client } = useApolloClient();
      try {
        const { data } = await client.query({ query: FormQuery, variables: { id } });
        if (data?.form) {
          const form = data.form;
          this.formName = form.name;
          const formElementStore = useFormElementStore();

          // Ensure every field has a unique client-side ID for reactivity.
          const fieldsWithIds = form.fields.map(field => ({
            ...field,
            id: field.id || (Date.now().toString(36) + Math.random().toString(36).substring(2, 9)),
          }));

          formElementStore.initializeForm(fieldsWithIds);
          this.editingFormId = form._id;
        }
      } catch (error: any) {
        console.error("Error fetching form by id:", error);
        throw error;
      }
    },

    clearEditingFormId() {
      this.editingFormId = null;
    },

    async submitForm(practiceId: string, formId: string, formData: Record<string, any>) {
      const practiceStore = usePracticeStore();
      
      if (!practiceStore.currentPractice?.protocol?._id) {
        throw new Error('Protocol ID not found for current practice.');
      }
      const protocolId = practiceStore.currentPractice.protocol._id;

      // Get the mutation functions
      const { mutate: submitProtocol } = useMutation(SubmitProtocolMutation);
      const { mutate: registerSubmission } = useMutation(RegisterFormSubmissionMutation);

      try {
        // Step 1: Create the Submission
        const submitResult = await submitProtocol({
          createSubmissionInput: {
            formId,
            protocolId,
            data: formData,
          },
        });
        if (submitResult?.errors) {
          throw new Error(submitResult.errors[0]?.message || 'Error submitting form data');
        }
        const submissionId = submitResult?.data.submitProtocol._id;
        if (!submissionId) {
          throw new Error('Failed to get submission ID from the server.');
        }

        // Step 2: Register the Submission in the Practice
        const registerResult = await registerSubmission({
          formId,
          practiceId,
          submissionId,
        });
        if (registerResult?.errors) {
          throw new Error(registerResult.errors[0]?.message || 'Error registering form submission with practice');
        }

        console.log('Formulario guardado y registrado exitosamente.');
      } catch (error: any) {
        console.error('Error al guardar el formulario:', error);
        throw error;
      }
    },

    async deleteForm(id: string) {
      const { mutate } = useMutation(RemoveFormMutation);
      try {
        const result = await mutate({ id: id });
        if (result?.errors) {
          throw new Error(result.errors[0]?.message || 'Error deleting form');
        }
        // Remove the deleted form from the store's forms array
        this.forms = this.forms.filter(form => form._id !== id);
      } catch (error: any) {
        console.error('Error deleting form:', error);
        throw error;
      }
    },
  },
  persist: true,
});