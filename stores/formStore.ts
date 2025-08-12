import { defineStore } from "pinia";
import { ref } from "vue";
import { useMutation, useApolloClient } from "@vue/apollo-composable";
import { useAsyncQuery } from "#imports";
import type { Form } from "~/types";

// Importar queries/mutations
import CreateFormMutation from "~/queries/createForm.gql";
import CreateManyFormsMutation from "~/queries/createManyForms.gql";
import UpdateFormMutation from "~/queries/updateForm.gql";
import GetFormQuery from "~/queries/form.gql";
import GetFormsQuery from "~/queries/forms.gql";
import DeleteFormMutation from "~/queries/deleteForm.gql";
import { useFormElementStore } from "./formElementStore";
import gql from "graphql-tag";

export const useFormStore = defineStore("form", () => {
  const { client: apolloClient } = useApolloClient();

  // State
  const formName = ref<string>("");
  const editingFormId = ref<string | null>(null);
  const forms = ref<Form[]>([]);
  const currentForm = ref<Form | null>(null);
  const formElementStore = useFormElementStore();
  const loading = ref<boolean>(true);

  // Actions
  const createForm = async (input: any) => {
    const { data } = await apolloClient.mutate({
      mutation: CreateFormMutation,
      variables: { input },
    });
    return data?.createForm;
  };

  const createManyForms = async (createFormInputs: any) => {
    const { data } = await apolloClient.mutate({
      mutation: CreateManyFormsMutation,
      variables: { createFormInputs },
    });
    return data?.createManyForms;
  };

  const updateForm = async (id: string, input: any) => {
    const { data } = await apolloClient.mutate({
      mutation: UpdateFormMutation,
      variables: { id, input },
    });
    return data?.updateForm;
  };

  const fetchFormById = async (id: string) => {
    const { data, execute, error } = useAsyncQuery<{ form: Form }>(
      GetFormQuery,
      { id }
    );

    await execute();

    if (error.value) {
      console.error(
        "fetchFormById: Error al cargar el formulario:",
        error.value
      );
      throw new Error(
        error.value.message || "Error desconocido al cargar el formulario."
      );
    }

    if (data.value?.form) {
      formName.value = data.value.form.name;
      editingFormId.value = data.value.form.id ?? null;
      currentForm.value = data.value.form;
      formElementStore.chargeFieldsOnForm(data.value.form.fields || []);
    } else {
      console.log(
        "fetchFormById: No se encontró el formulario o los datos están vacíos."
      );
    }
  };

  const fetchForms = async () => {
    console.log("fetchForms: Intentando cargar todos los formularios...");
    try {
      const { data, errors } = await apolloClient.query({
        query: GetFormsQuery,
        fetchPolicy: "network-only",
      });
      if (errors) {
        console.error("fetchForms: Errores de GraphQL:", errors);
        throw errors;
      }
      forms.value = data.forms;
    } catch (error: any) {
      console.error("formStore: Error fetching forms:", error);
      throw new Error(
        error.message || "Error desconocido al cargar formularios."
      );
    }
  };

  const deleteForm = async (id: string): Promise<boolean> => {
    try {
      const { data, errors } = await apolloClient.mutate({
        mutation: DeleteFormMutation,
        variables: { id },
      });
      if (errors) {
        throw new Error(errors[0]?.message || "Error al eliminar formulario");
      }
      return data?.deleteForm;
    } catch (error: any) {
      console.error("formStore: DeleteForm error:", error);
      throw new Error(
        error.message || "Error desconocido al eliminar formulario."
      );
    }
  };

  const createNewFormVersion = async (formId: string): Promise<Form> => {
    try {
      const { data, errors } = await apolloClient.mutate({
        mutation: gql`
          mutation createNewFormVersion($formId: ID!) {
            createNewFormVersion(formId: $formId) {
              id
              name
              version
              parentForm {
                id
                name
                version
              }
            }
          }
        `,
        variables: { formId },
      });
      if (errors) {
        throw new Error(
          errors[0]?.message || "Error al crear nueva versión del formulario"
        );
      }
      return data?.createNewFormVersion;
    } catch (error: any) {
      console.error("formStore: createNewFormVersion error:", error);
      throw new Error(
        error.message ||
          "Error desconocido al crear nueva versión del formulario."
      );
    }
  };

  const clearEditingFormId = () => {
    editingFormId.value = null;
  };

  return {
    formName,
    editingFormId,
    forms,
    currentForm,
    createForm,
    createManyForms,
    updateForm,
    fetchFormById,
    fetchForms,
    deleteForm,
    createNewFormVersion,
    clearEditingFormId,
  };
});
