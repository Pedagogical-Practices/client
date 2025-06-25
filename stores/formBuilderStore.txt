import { defineStore } from "pinia";

export interface FormElement {
  id: string;
  type: string;
  label: string;
  value?: any;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  name?: string;
  specificType?: string;
  height?: string | number;
  width?: string | number;
  color?: string;
  options?: string[] | { text: string; value: any }[];
  rules?: string[];
  variableName?: string;
  chapter?: string;
  question?: string;
  questionNumber?: string;
  consistencyCondition?: string;
  inconsistencyMessage?: string;
  errorType?: "Soft" | "Hard" | string;
  description?: string;
  requirementLevel?: "Required" | "Optional" | "Conditional" | string;
}

export interface Form {
  _id: string;
  name: string;
  fields: FormElement[];
  createdBy: string;
  createdAt: string;
}

export interface Course {
  _id: string;
  name: string;
  institution: string;
  assignedGroups: string[];
  createdBy: string;
  createdAt: string;
}

export interface Protocol {
  _id: string;
  courseId: string;
  name: string;
  module: string;
  formId: string;
  createdAt: string;
}

export interface Submission {
  _id: string;
  protocolId: string;
  formId: string;
  data: Record<string, any>;
  submittedBy: string;
  createdAt: string;
}

export interface FormBuilderState {
  formElements: FormElement[];
  selectedElementId: string | null;
  formName: string;
  forms: Form[];
  currentForm: Form | null;
  courses: Course[];
  currentCourse: Course | null;
  protocols: Protocol[];
  currentProtocol: Protocol | null;
  submissions: Submission[];
}

export const useFormBuilderStore = defineStore("formBuilder", {
  state: (): FormBuilderState => ({
    formElements: [],
    selectedElementId: null,
    formName: "",
    forms: [],
    currentForm: null,
    courses: [],
    currentCourse: null,
    protocols: [],
    currentProtocol: null,
    submissions: [],
  }),
  actions: {
    // Formularios existentes
    addElement(element: FormElement) {
      if (!element.id) {
        element.id =
          Date.now().toString() + Math.random().toString(36).substring(2, 9);
      }
      this.formElements.push(element);
    },
    removeElement(elementId: string) {
      this.formElements = this.formElements.filter((el) => el.id !== elementId);
      if (this.selectedElementId === elementId) {
        this.selectedElementId = null;
      }
    },
    updateElement(updatedElement: FormElement) {
      const index = this.formElements.findIndex(
        (el) => el.id === updatedElement.id
      );
      if (index !== -1) {
        this.formElements[index] = updatedElement;
      }
    },
    setSelectedElement(elementId: string | null) {
      this.selectedElementId = elementId;
    },
    initializeForm(elements: FormElement[]) {
      this.formElements = elements;
      this.selectedElementId = null;
    },
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
    // Cursos
    async fetchCourses() {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const query = await import("~/queries/courses.gql?raw").then(
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
          throw new Error(data.errors[0]?.message || "Error fetching courses");
        }
        this.courses = data.data.courses;
      } catch (error: any) {
        console.error("Error fetching courses:", error);
      }
    },
    async fetchCourse(id: string) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const query = await import("~/queries/course.gql?raw").then(
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
          throw new Error(data.errors[0]?.message || "Error fetching course");
        }
        this.currentCourse = data.data.course;
      } catch (error: any) {
        console.error("Error fetching course:", error);
      }
    },
    async createCourse(input: {
      name: string;
      institution: string;
      assignedGroups: string[];
    }) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const mutation = await import("~/queries/createCourse.gql?raw").then(
          (m) => m.default
        );
        const response = await fetch(GQL_HOST, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuthStore().token}`,
          },
          body: JSON.stringify({
            query: mutation,
            variables: { createCourseInput: input },
          }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0]?.message || "Error creating course");
        }
        this.courses.push(data.data.createCourse);
      } catch (error: any) {
        console.error("Error creating course:", error);
        throw error;
      }
    },
    // Protocolos
    async fetchProtocols(courseId: string) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const query = await import("~/queries/protocols.gql?raw").then(
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
            variables: { courseId },
          }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(
            data.errors[0]?.message || "Error fetching protocols"
          );
        }
        this.protocols = data.data.protocols;
      } catch (error: any) {
        console.error("Error fetching protocols:", error);
      }
    },
    async fetchProtocol(id: string) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const query = await import("~/queries/protocol.gql?raw").then(
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
          throw new Error(data.errors[0]?.message || "Error fetching protocol");
        }
        this.currentProtocol = data.data.protocol;
      } catch (error: any) {
        console.error("Error fetching protocol:", error);
      }
    },
    async createProtocol(input: {
      courseId: string;
      name: string;
      module: string;
      formId: string;
    }) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const mutation = await import("~/queries/createProtocol.gql?raw").then(
          (m) => m.default
        );
        const response = await fetch(GQL_HOST, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuthStore().token}`,
          },
          body: JSON.stringify({
            query: mutation,
            variables: { createProtocolInput: input },
          }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0]?.message || "Error creating protocol");
        }
        this.protocols.push(data.data.createProtocol);
      } catch (error: any) {
        console.error("Error creating protocol:", error);
        throw error;
      }
    },
    // Envíos
    async submitProtocol(input: {
      protocolId: string;
      formId: string;
      data: Record<string, any>;
    }) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const mutation = await import("~/queries/submitProtocol.gql?raw").then(
          (m) => m.default
        );
        const response = await fetch(GQL_HOST, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuthStore().token}`,
          },
          body: JSON.stringify({
            query: mutation,
            variables: { createSubmissionInput: input },
          }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(
            data.errors[0]?.message || "Error submitting protocol"
          );
        }
        this.submissions.push(data.data.submitProtocol);
      } catch (error: any) {
        console.error("Error submitting protocol:", error);
        throw error;
      }
    },
    async fetchSubmissions(protocolId: string) {
      try {
        const {
          public: { GQL_HOST },
        } = useRuntimeConfig();
        const query = await import("~/queries/submissions.gql?raw").then(
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
            variables: { protocolId },
          }),
        });
        const data = await response.json();
        if (data.errors) {
          throw new Error(
            data.errors[0]?.message || "Error fetching submissions"
          );
        }
        this.submissions = data.data.submissions;
      } catch (error: any) {
        console.error("Error fetching submissions:", error);
      }
    },
  },
  getters: {
    getElement:
      (state) =>
      (elementId: string): FormElement | undefined => {
        return state.formElements.find((el) => el.id === elementId);
      },
    getFormElements: (state): FormElement[] => {
      return state.formElements;
    },
    getSelectedElement: (state): FormElement | undefined => {
      if (state.selectedElementId) {
        return state.formElements.find(
          (el) => el.id === state.selectedElementId
        );
      }
      return undefined;
    },
  },
  persist: true,
});
