import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";

export interface Course {
  _id: string;
  name: string;
  institution: string;
  assignedGroups: string[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
}

export const useCourseStore = defineStore("course", {
  state: (): CourseState => ({
    courses: [],
    currentCourse: null,
  }),
  actions: {
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

        console.log("fetchCourses: Token:", useAuthStore().token);

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
  },
  persist: true,
});
