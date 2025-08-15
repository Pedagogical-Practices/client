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
  [DataSourceType.COURSES]: { query: GetPractices, dataKey: "practices" }, // Legacy support
  [DataSourceType.INSTITUTIONS]: { query: GetInstitutions, dataKey: "institutions" },
  [DataSourceType.USERS]: { query: GetUsers, dataKey: "users" },
};

export const useDataSourceStore = defineStore("dataSource", () => {
  const { client } = useApolloClient();
  const authStore = useAuthStore();

  const fetchFormattedOptions = async (dataSource: DataSourceType): Promise<Array<{ title: string; value: string }>> => {
    if (!dataSource) return [];

    const config = dataSourceConfigs[dataSource];
    if (!config) {
      console.warn("dataSourceStore: Unknown dataSource", dataSource);
      return [];
    }

    try {
      const { data, errors } = await client.query({ 
        query: config.query, 
        fetchPolicy: 'network-only' 
      });

      if (errors) {
        console.error("dataSourceStore: GraphQL errors", errors);
        throw new Error(errors.map((e) => e.message).join(", "));
      }

      if (data && data[config.dataKey]) {
        let items = data[config.dataKey];
        
        // Safer filtering for roles
        if (dataSource === DataSourceType.TEACHERS) {
          items = items.filter(
            (user: any) => user && user.roles && (user.roles.includes(UserRole.TEACHER_DIRECTIVE) || user.roles.includes(UserRole.TUTOR))
          );
        } else if (dataSource === DataSourceType.STUDENTS) {
          items = items.filter((user: any) => user && user.roles && user.roles.includes(UserRole.STUDENT));
        }

        // Improved and safer mapping logic
        const formatted = items.map((item: any) => {
          let title = item.name; // Default for institutions, forms, etc.

          // Specific, robust logic for users
          if (dataSource === DataSourceType.STUDENTS || dataSource === DataSourceType.TEACHERS || dataSource === DataSourceType.USERS) {
            const nameParts = [item.firstName, item.middleName, item.lastName, item.secondLastName];
            title = nameParts.filter(part => part).join(' '); // Filters out null/undefined parts and joins
          }
          
          return { title: title, value: item.id };
        });

        return formatted;
      }
    } catch (err) {
      console.error(`Error fetching data for ${dataSource}:`, err);
    }

    return [];
  };

  return {
    fetchFormattedOptions,
  };
});
