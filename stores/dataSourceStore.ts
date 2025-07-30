import { defineStore } from "pinia";
import { useApolloClient } from "@vue/apollo-composable";
import { useAuthStore } from "~/stores/authStore";
import { UserRole, DataSourceType } from "~/types";

// Importar las queries
import GetUsers from "~/queries/dataSources/getUsers.gql";
import GetForms from "~/queries/dataSources/getForms.gql";
import GetProtocols from "~/queries/dataSources/getProtocols.gql";
import GetCourses from "~/queries/dataSources/getCourses.gql";
import GetInstitutions from "~/queries/dataSources/getInstitutions.gql";

interface DataSourceConfig {
  query: any;
  dataKey: string;
}

const dataSourceConfigs: Record<DataSourceType, DataSourceConfig> = {
  [DataSourceType.STUDENTS]: { query: GetUsers, dataKey: "users" },
  [DataSourceType.TEACHERS]: { query: GetUsers, dataKey: "users" },
  [DataSourceType.FORMS]: { query: GetForms, dataKey: "forms" },
  [DataSourceType.PROTOCOLS]: { query: GetProtocols, dataKey: "protocols" },
  [DataSourceType.COURSES]: { query: GetCourses, dataKey: "courses" },
  [DataSourceType.INSTITUTIONS]: { query: GetInstitutions, dataKey: "institutions" },
  [DataSourceType.USERS]: { query: GetUsers, dataKey: "users" },
};

export const useDataSourceStore = defineStore("dataSource", () => {
  const { client } = useApolloClient();
  const authStore = useAuthStore();

  const fetchFormattedOptions = async (dataSource: DataSourceType): Promise<string> => {
    console.log(
      "dataSourceStore: fetchFormattedOptions called with",
      dataSource
    );
    if (!dataSource) return "";

    const config = dataSourceConfigs[dataSource];
    if (!config) {
      console.warn("dataSourceStore: Unknown dataSource", dataSource);
      return "";
    }

    // Manejo especial para el estudiante actual
    if (dataSource === DataSourceType.STUDENTS && authStore.user?.role === UserRole.STUDENT) {
      const studentName = authStore.user.name || authStore.user.email;
      return `${authStore.user.id}|${studentName}`;
    }

    console.log("dataSourceStore: Generated query:", config.query);

    try {
      console.log("dataSourceStore: Executing query", config.query);
      const { data, errors } = await client.query({ query: config.query });

      if (errors) {
        console.error("dataSourceStore: GraphQL errors", errors);
        throw new Error(errors.map((e) => e.message).join(", "));
      }

      console.log("dataSourceStore: Data received", data);

      if (data && data[config.dataKey]) {
        let items = data[config.dataKey];
        if (dataSource === DataSourceType.TEACHERS) {
          items = items.filter(
            (user: any) => user.role === UserRole.TEACHER_DIRECTIVE
          );
        } else if (dataSource === DataSourceType.STUDENTS) {
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
