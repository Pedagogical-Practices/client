import { defineStore } from "pinia";
import { ref } from "vue";
import { useApolloClient, useMutation } from "@vue/apollo-composable";
import { gql } from "graphql-tag";
import type { Course } from "~/types";

export const useCourseStore = defineStore(
  "course",
  () => {
    const { client: apolloClient } = useApolloClient();

    // State
    const courses = ref<Course[]>([]);
    const currentCourse = ref<Course | null>(null);

    // Actions
    const fetchCourses = async () => {
      try {
        const { data, errors } = await apolloClient.query({
          query: gql`
            query Courses {
              courses {
                id
                name
                description
                startDate
                endDate
                protocols {
                  id
                  name
                }
                createdAt
                updatedAt
              }
            }
          `,
          fetchPolicy: "network-only",
        });
        if (errors) throw errors;
        courses.value = data.courses;
      } catch (error: any) {
        console.error("courseStore: Error fetching courses:", error);
        throw new Error(error.message || "Error desconocido al cargar cursos.");
      }
    };

    const fetchCourse = async (id: string) => {
      try {
        const { data, errors } = await apolloClient.query({
          query: gql`
            query Course($id: ID!) {
              course(id: $id) {
                id
                name
                description
                startDate
                endDate
                protocols {
                  id
                  name
                }
                createdAt
                updatedAt
              }
            }
          `,
          variables: { id },
          fetchPolicy: "network-only",
        });
        if (errors) throw errors;
        currentCourse.value = data.course;
      } catch (error: any) {
        console.error("courseStore: Error fetching course:", error);
        throw new Error(
          error.message || "Error desconocido al cargar curso por ID."
        );
      }
    };

    const createCourse = async (input: any): Promise<Course> => {
      const { mutate } = useMutation(gql`
        mutation CreateCourse($input: CreateCourseInput!) {
          createCourse(input: $input) {
            id
            name
            description
            startDate
            endDate
            protocols {
              id
              name
            }
            createdAt
            updatedAt
          }
        }
      `);
      try {
        console.log('courseStore: Input to createCourse mutation:', input); // NEW LOG
        const result = await mutate({ input });
        if (result?.errors) {
          throw new Error(result.errors[0]?.message || "Error al crear curso");
        }
        return result?.data?.createCourse;
      } catch (error: any) {
        console.error("courseStore: CreateCourse error:", error);
        throw new Error(error.message || "Error desconocido al crear curso.");
      }
    };

    const updateCourse = async (id: string, input: any): Promise<Course> => {
      const { mutate } = useMutation(gql`
        mutation UpdateCourse($id: ID!, $input: UpdateCourseInput!) {
          updateCourse(id: $id, input: $input) {
            id
            name
            description
            startDate
            endDate
            protocols {
              id
              name
            }
            createdAt
            updatedAt
          }
        }
      `);
      try {
        const result = await mutate({ id, input });
        if (result?.errors) {
          throw new Error(
            result.errors[0]?.message || "Error al actualizar curso"
          );
        }
        return result?.data?.updateCourse;
      } catch (error: any) {
        console.error("courseStore: UpdateCourse error:", error);
        throw new Error(
          error.message || "Error desconocido al actualizar curso."
        );
      }
    };

    const deleteCourse = async (id: string): Promise<boolean> => {
      const { mutate } = useMutation(gql`
        mutation DeleteCourse($id: ID!) {
          deleteCourse(id: $id)
        }
      `);
      try {
        const result = await mutate({ id });
        if (result?.errors) {
          throw new Error(
            result.errors[0]?.message || "Error al eliminar curso"
          );
        }
        return result?.data?.deleteCourse;
      } catch (error: any) {
        console.error("courseStore: DeleteCourse error:", error);
        throw new Error(
          error.message || "Error desconocido al eliminar curso."
        );
      }
    };

    return {
      courses,
      currentCourse,
      fetchCourses,
      fetchCourse,
      createCourse,
      updateCourse,
      deleteCourse,
    };
  },
  { persist: true }
);
