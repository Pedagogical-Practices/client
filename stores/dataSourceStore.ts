import { defineStore } from "pinia";
import { useApolloClient } from "@vue/apollo-composable";
import { useAuthStore } from "~/stores/authStore";
import { UserRole, DataSourceType } from "~/types";

// Importar las queries
import GetUsers from "~/queries/dataSources/getUsers.gql";
import GetForms from "~/queries/dataSources/getForms.gql";
import GetProtocols from "~/queries/dataSources/getProtocols.gql";
import GetPractices from "~/queries/dataSources/getPractices.gql";
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
  [DataSourceType.PRACTICES]: { query: GetPractices, dataKey: "practices" },
  [DataSourceType.COURSES]: { query: GetPractices, dataKey: "practices" },
  [DataSourceType.INSTITUTIONS]: { query: GetInstitutions, dataKey: "institutions" },
  [DataSourceType.USERS]: { query: GetUsers, dataKey: "users" },
};

export const useDataSourceStore = defineStore("dataSource", () => {
  const { client } = useApolloClient();
  const authStore = useAuthStore();

  const fetchFormattedOptions = async (dataSource: DataSourceType): Promise<Array<{ title: string; value: string }>> => {
    console.log(
      "dataSourceStore: fetchFormattedOptions called with",
      dataSource
    );
    if (!dataSource) return [];

    const config = dataSourceConfigs[dataSource];
    if (!config) {
      console.warn("dataSourceStore: Unknown dataSource", dataSource);
      return [];
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
        
        // Filter users by role if dataSource is STUDENTS or TEACHERS
        if (dataSource === DataSourceType.TEACHERS) {
          items = items.filter(
            (user: any) => user.roles.includes(UserRole.TEACHER_DIRECTIVE)
          );
        } else if (dataSource === DataSourceType.STUDENTS) {
          items = items.filter((user: any) => user.roles.includes(UserRole.STUDENT));
        }

        const formatted = items.map((item: any) => {
          let title = item.name; // Default to item.name
          if (item.firstName && item.lastName) {
            title = `${item.firstName} ${item.lastName}`;
          }
          return { title: title, value: item.id };
        });
        console.log("dataSourceStore: Formatted options", formatted);
        return formatted;
      }
    } catch (err) {
      console.error(`Error fetching data for ${dataSource}:`, err);
    }

    console.log("dataSourceStore: Returning empty array");
    return [];
  };

  return {
    fetchFormattedOptions,
  };
});
