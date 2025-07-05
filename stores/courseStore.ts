import { defineStore } from "pinia";
import type { Course, CreateCourseInput } from "~/types/course";

// Import GQL documents
import CoursesQuery from "~/queries/courses.gql";
import CourseQuery from "~/queries/course.gql";
import CreateCourseMutation from "~/queries/createCourse.gql";

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
      const { data, error } = await useAsyncQuery(CoursesQuery);
      if (error.value) {
        console.error("Error fetching courses:", error.value);
        return;
      }
      if (data.value?.courses) {
        this.courses = data.value.courses;
      }
    },

    async fetchCourse(id: string) {
      const { data, error } = await useAsyncQuery(CourseQuery, { id });
      if (error.value) {
        console.error("Error fetching course:", error.value);
        return;
      }
      if (data.value?.course) {
        this.currentCourse = data.value.course;
      }
    },

    async createCourse(input: CreateCourseInput) {
      const { mutate, error } = useMutation(CreateCourseMutation);
      try {
        const result = await mutate({ createCourseInput: input });
        if (result?.errors) {
          throw new Error(result.errors[0]?.message || "Error creating course");
        }
        if (result?.data?.createCourse) {
          this.courses.push(result.data.createCourse);
        }
      } catch (err: any) {
        console.error("Error creating course:", err);
        throw err;
      }
    },
  },
  persist: true,
});