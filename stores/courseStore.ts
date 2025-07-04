import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import type { Course, CreateCourseInput } from "~/types/course"; // Asume que tienes estos tipos

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
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.query({ query: CoursesQuery });
        this.courses = data.courses;
      } catch (error: any) {
        console.error("Error fetching courses:", error);
      }
    },

    async fetchCourse(id: string) {
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.query({
          query: CourseQuery,
          variables: { id },
        });
        this.currentCourse = data.course;
      } catch (error: any) {
        console.error("Error fetching course:", error);
      }
    },

    async createCourse(input: CreateCourseInput) {
      const { $gqlClient } = useNuxtApp();
      try {
        const { data } = await $gqlClient.mutate({
          mutation: CreateCourseMutation,
          variables: { createCourseInput: input },
        });
        this.courses.push(data.createCourse);
      } catch (error: any) {
        console.error("Error creating course:", error);
        throw error;
      }
    },
  },
  persist: true,
});