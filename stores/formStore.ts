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
import GetFormsQuery from "~/queries/forms.gql"; // Nueva importación
import DeleteFormMutation from "~/queries/removeForm.gql"; // Nueva importación

export const useFormStore = defineStore("form", () => {
  const { client: apolloClient } = useApolloClient(); // Obtener la instancia de apolloClient

  // State
  const formName = ref<string>("");
  const editingFormId = ref<string | null>(null);
  const forms = ref<Form[]>([]); // Nueva propiedad de estado

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
    const { data, execute } = useAsyncQuery<{ form: Form }>(GetFormQuery, {
      id,
    });
    await execute();
    if (data.value?.form) {
      formName.value = data.value.form.name;
      editingFormId.value = data.value.form.id ?? null;
      // Aquí podrías también cargar los fields en formElementStore si es necesario
    }
  };

  const fetchForms = async () => {
    // Nuevo método
    try {
      const { data, errors } = await apolloClient.query({
        query: GetFormsQuery,
        fetchPolicy: "network-only",
      });
      if (errors) throw errors;
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

  const clearEditingFormId = () => {
    editingFormId.value = null;
  };

  return {
    formName,
    editingFormId,
    forms,
    createForm,
    createManyForms,
    updateForm,
    fetchFormById,
    fetchForms,
    deleteForm,
    clearEditingFormId,
  };
});
