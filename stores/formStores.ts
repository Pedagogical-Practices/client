import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import type { Form } from "~/types/form";
import type { FormElement } from "~/stores/formElementStore";
import { useFormElementStore } from "~/stores/formElementStore";
import { usePracticeStore } from "~/stores/practiceStore";

import FormsQuery from "~/queries/forms.gql?raw";
import FormQuery from "~/queries/form.gql?raw";
import SubmitProtocolMutation from '~/queries/submitProtocol.gql?raw';
import RegisterFormSubmissionMutation from '~/queries/registerFormSubmission.gql?raw';

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
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.query({ query: FormsQuery });
        this.forms = data.forms;
      } catch (error: any) {
        console.error("Error fetching forms:", error);
      }
    },

    async fetchForm(id: string) {
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.query({ query: FormQuery, variables: { id } });
        this.currentForm = data.form;
      } catch (error: any) {
        console.error("Error fetching form:", error);
      }
    },

    async fetchFormById(id: string) {
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.query({ query: FormQuery, variables: { id } });
        const form = data.form;
        this.formName = form.name;
        const formElementStore = useFormElementStore();
        formElementStore.initializeForm(form.fields);
      } catch (error: any) {
        console.error("Error fetching form by id:", error);
        throw error;
      }
    },

    async submitForm(practiceId: string, formId: string, formData: Record<string, any>) {
      const { $gqlClient } = useNuxtApp();
      const practiceStore = usePracticeStore();
      
      if (!practiceStore.currentPractice?.protocol?._id) {
        throw new Error('Protocol ID not found for current practice.');
      }
      const protocolId = practiceStore.currentPractice.protocol._id;

      try {
        // Paso 1: Crear la Submission
        const { data: submitData } = await client.mutate({
          mutation: SubmitProtocolMutation,
          variables: {
            createSubmissionInput: {
              formId,
              protocolId,
              data: formData,
            },
          },
        });
        const submissionId = submitData.submitProtocol._id;

        // Paso 2: Registrar la Submission en la Practice
        await client.mutate({
          mutation: RegisterFormSubmissionMutation,
          variables: {
            formId,
            practiceId,
            submissionId,
          },
        });

        console.log('Formulario guardado y registrado exitosamente.');
      } catch (error: any) {
        console.error('Error al guardar el formulario:', error);
        throw error;
      }
    },
  },
  persist: true,
});