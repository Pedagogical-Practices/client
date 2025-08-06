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

  // Actions
  const createForm = async (input: any) => {
    const { mutate } = useMutation(CreateFormMutation);
    const result = await mutate({ input });
    return result?.data?.createForm;
  };

  const createManyForms = async (createFormInputs: any) => {
    const { mutate } = useMutation(CreateManyFormsMutation);
    const result = await mutate({ createFormInputs });
    return result?.data?.createManyForms;
  };

  const updateForm = async (id: string, input: any) => {
    const { mutate } = useMutation(UpdateFormMutation);
    const result = await mutate({ id, input });
    return result?.data?.updateForm;
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
    // Nuevo método
    const { mutate } = useMutation(DeleteFormMutation);
    try {
      const result = await mutate({ id });
      if (result?.errors) {
        throw new Error(
          result.errors[0]?.message || "Error al eliminar formulario"
        );
      }
      return result?.data?.deleteForm;
    } catch (error: any) {
      console.error("formStore: DeleteForm error:", error);
      throw new Error(
        error.message || "Error desconocido al eliminar formulario."
      );
    }
  };

  const createNewFormVersion = async (formId: string): Promise<Form> => {
    const { mutate } = useMutation(gql`
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
    `);
    try {
      const result = await mutate({ formId });
      if (result?.errors) {
        throw new Error(
          result.errors[0]?.message ||
            "Error al crear nueva versión del formulario"
        );
      }
      return result?.data?.createNewFormVersion;
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
