import { defineStore } from "pinia";
import { gql } from "graphql-tag";
import { useApolloClient } from "@vue/apollo-composable";
import { useAuthStore } from "~/stores/authStore";
import { UserRole } from "~/types";

export const useDataSourceStore = defineStore("dataSource", () => {
  const { client } = useApolloClient();
  const authStore = useAuthStore();

  const fetchFormattedOptions = async (dataSource: string): Promise<string> => {
    console.log(
      "dataSourceStore: fetchFormattedOptions called with",
      dataSource
    );
    if (!dataSource) return "";

    let query;
    let dataKey = dataSource;

    if (dataSource === "students") {
      if (authStore.user?.role === UserRole.STUDENT) {
        const studentName = authStore.user.name || authStore.user.email;
        return `${authStore.user.id}|${studentName}`;
      }
      query = gql`
        query GetUsers {
          users {
            id
            name
            role
          }
        }
      `;
      dataKey = "users";
    } else if (dataSource === "teachers") {
      query = gql`
        query GetUsers {
          users {
            id
            name
            role
          }
        }
      `;
      dataKey = "users";
    } else if (dataSource === "forms") {
      query = gql`
        query GetForms {
          forms {
            id
            name
          }
        }
      `;
    } else if (dataSource === "protocols") {
      query = gql`
        query GetProtocols {
          protocols {
            id
            name
          }
        }
      `;
    } else if (dataSource === "courses") {
      query = gql`
        query GetCourses {
          courses {
            id
            name
          }
        }
      `;
    } else {
      console.warn("dataSourceStore: Unknown dataSource", dataSource);
      return "";
    }

    console.log("dataSourceStore: Generated query:", query);

    try {
      console.log("dataSourceStore: Executing query", query);
      const { data, errors } = await client.query({ query });

      if (errors) {
        console.error("dataSourceStore: GraphQL errors", errors);
        throw new Error(errors.map((e) => e.message).join(", "));
      }

      console.log("dataSourceStore: Data received", data);

      if (data && data[dataKey]) {
        let items = data[dataKey];
        if (dataSource === "teachers") {
          items = items.filter(
            (user: any) => user.role === UserRole.TEACHER_DIRECTIVE
          );
        } else if (dataSource === "students") {
          items = items.filter((user: any) => user.role === UserRole.STUDENT);
        }
        const formatted = items
          .map((item: any) => `${item.id}|${item.name}`)
          .join("\n");
        console.log("dataSourceStore: Formatted options", formatted);
        return formatted;
      }
    } catch (err) {
      console.error(`Error fetching data for ${dataSource}:`, err);
    }

    console.log("dataSourceStore: Returning empty string");
    return "";
  };

  return {
    fetchFormattedOptions,
  };
});
