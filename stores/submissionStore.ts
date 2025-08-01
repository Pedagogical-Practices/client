import { defineStore } from "pinia";
import { ref } from 'vue';
import { useApolloClient, useMutation } from '@vue/apollo-composable';
import { gql } from 'graphql-tag';

interface SubmissionState {
  submissions: any[];
  currentSubmission: any | null;
}

export const useSubmissionStore = defineStore("submission", () => {
  const { client } = useApolloClient();

  // State
  const submissions = ref<any[]>([]);
  const currentSubmission = ref<any | null>(null);

  // Actions
  const setCurrentSubmission = (submission: Submission | null) => {
    currentSubmission.value = submission;
  };

  const createSubmission = async (input: any): Promise<Submission | null> => {
    const { mutate } = useMutation(gql`mutation CreateSubmission($input: CreateSubmissionInput!) { createSubmission(input: $input) { id practice { id } protocol { id } formData locationData score feedback createdAt updatedAt } }`);
    try {
      const result = await mutate({ input });
      if (result?.errors) {
        throw new Error(result.errors[0]?.message || "Error creating submission");
      }
      return result?.data?.createSubmission || null;
    } catch (error: any) {
      console.error("submissionStore: Error creating submission:", error);
      throw new Error(error.message || "Error desconocido al crear entrega.");
    }
  };

  const updateSubmission = async (id: string, input: any): Promise<Submission | null> => {
    const { mutate } = useMutation(gql`mutation UpdateSubmission($id: ID!, $input: UpdateSubmissionInput!) { updateSubmission(id: $id, input: $input) { id formData locationData score feedback createdAt updatedAt } }`);
    try {
      const result = await mutate({ id, input });
      if (result?.errors) {
        throw new Error(result.errors[0]?.message || "Error updating submission");
      }
      return result?.data?.updateSubmission || null;
    } catch (error: any) {
      console.error("submissionStore: Error updating submission:", error);
      throw new Error(error.message || "Error desconocido al actualizar entrega.");
    }
  };

  const fetchSubmission = async (id: string): Promise<Submission | null> => {
    try {
      const { data, errors } = await client.query({ query: gql`query Submission($id: ID!) { submission(id: $id) { id practice { id student { id name } teacher { id name } } protocol { id name form { id name fields { name label type options rules } } } formData locationData score feedback createdAt updatedAt } }`, variables: { id }, fetchPolicy: 'network-only' });
      if (errors) throw errors;
      currentSubmission.value = data.submission;
      return data.submission;
    } catch (error: any) {
      console.error("submissionStore: Error fetching submission:", error);
      throw new Error(error.message || "Error desconocido al cargar entrega.");
    }
  };

  const fetchSubmissions = async (): Promise<Submission[]> => {
    try {
      const { data, errors } = await client.query({ query: gql`query Submissions { submissions { id practice { id student { id name } teacher { id name } } protocol { id name } formData locationData score feedback createdAt updatedAt } }`, fetchPolicy: 'network-only' });
      if (errors) throw errors;
      submissions.value = data.submissions;
      return data.submissions;
    } catch (error: any) {
      console.error("submissionStore: Error fetching submissions:", error);
      throw new Error(error.message || "Error desconocido al cargar entregas.");
    }
  };

  const evaluateSubmission = async (id: string, score: number, feedback: string): Promise<Submission | null> => {
    const { mutate } = useMutation(gql`mutation EvaluateSubmission($id: ID!, $score: Float!, $feedback: String!) { evaluateSubmission(id: $id, score: $score, feedback: $feedback) { id score feedback } }`);
    try {
      const result = await mutate({ id, score, feedback });
      if (result?.errors) {
        throw new Error(result.errors[0]?.message || "Error al evaluar la entrega");
      }
      return result?.data?.evaluateSubmission || null;
    } catch (error: any) {
      console.error("submissionStore: Error evaluating submission:", error);
      throw new Error(error.message || "Error desconocido al evaluar entrega.");
    }
  };

  const generateSubmissionPdf = async (submissionId: string): Promise<string | null> => {
    const { mutate } = useMutation(gql`mutation GenerateSubmissionPdf($submissionId: ID!) { generateSubmissionPdf(submissionId: $submissionId) }`);
    try {
      const result = await mutate({ submissionId });
      if (result?.errors) {
        throw new Error(result.errors[0]?.message || "Error al generar PDF");
      }
      return result?.data?.generateSubmissionPdf || null;
    } catch (error: any) {
      console.error("submissionStore: Error generating PDF:", error);
      throw new Error(error.message || "Error desconocido al generar PDF.");
    }
  };

  return {
    submissions,
    currentSubmission,
    setCurrentSubmission,
    createSubmission,
    updateSubmission,
    fetchSubmission,
    fetchSubmissions,
    evaluateSubmission,
    generateSubmissionPdf,
  };
}, {
  persist: true,
});
