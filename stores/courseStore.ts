import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import type { Course, CreateCourseInput } from "~/types/course";

import CoursesQuery from "~/queries/courses.gql?raw";
import CourseQuery from "~/queries/course.gql?raw";
import CreateCourseMutation from "~/queries/createCourse.gql?raw";

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
      const { $apollo } = useNuxtApp();
      try {
        const result = await $apollo.default.query({ query: CoursesQuery });
        if (result.errors) {
          throw new Error(result.errors[0]?.message || "Error fetching courses");
        }
        this.courses = result.data.courses;
      } catch (error: any) {
        console.error("Error fetching courses:", error);
      }
    },

    async fetchCourse(id: string) {
      const { $apollo } = useNuxtApp();
      try {
        const result = await $apollo.default.query({ query: CourseQuery, variables: { id } });
        if (result.errors) {
          throw new Error(result.errors[0]?.message || "Error fetching course");
        }
        this.currentCourse = result.data.course;
      } catch (error: any) {
        console.error("Error fetching course:", error);
      }
    },

    async createCourse(input: CreateCourseInput) {
      const { $apollo } = useNuxtApp();
      try {
        const result = await $apollo.default.mutate({
          mutation: CreateCourseMutation,
          variables: { createCourseInput: input },
        });
        if (result.errors) {
          throw new Error(result.errors[0]?.message || "Error creating course");
        }
        this.courses.push(result.data.createCourse);
      } catch (error: any) {
        console.error("Error creating course:", error);
        throw error;
      }
    },
  },
  persist: true,
});