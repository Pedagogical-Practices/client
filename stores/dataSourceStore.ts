import { defineStore } from "pinia";
import { ref } from 'vue';
import { useApolloClient } from '@vue/apollo-composable';
import { UserRole, DataSourceType } from "~/types";

// Importar las queries
import GetUsers from "~/queries/dataSources/getUsers.gql";
import GetForms from "~/queries/dataSources/getForms.gql";
import GetProtocols from "~/queries/dataSources/getProtocols.gql";
import GetPractices from "~/queries/dataSources/getPractices.gql";
import GetInstitutions from "~/queries/dataSources/getInstitutions.gql";

// Queries for single items
import GetUserById from "~/queries/user.gql";
import GetInstitutionById from "~/queries/institution.gql";

interface DataSourceConfig {
  query: any;
  dataKey: string;
  singleQuery?: any; 
  singleDataKey?: string;
}

const dataSourceConfigs: Record<string, DataSourceConfig> = {
  [DataSourceType.STUDENTS]: { query: GetUsers, dataKey: "users", singleQuery: GetUserById, singleDataKey: "user" },
  [DataSourceType.TEACHERS]: { query: GetUsers, dataKey: "users", singleQuery: GetUserById, singleDataKey: "user" },
  [DataSourceType.FORMS]: { query: GetForms, dataKey: "forms" },
  [DataSourceType.PROTOCOLS]: { query: GetProtocols, dataKey: "protocols" },
  [DataSourceType.PRACTICES]: { query: GetPractices, dataKey: "practices" },
  [DataSourceType.INSTITUTIONS]: { query: GetInstitutions, dataKey: "institutions", singleQuery: GetInstitutionById, singleDataKey: "institution" },
  [DataSourceType.USERS]: { query: GetUsers, dataKey: "users", singleQuery: GetUserById, singleDataKey: "user" },
};

export const useDataSourceStore = defineStore("dataSource", () => {
  const { client } = useApolloClient();

  const fetchFormattedOptions = async (dataSource: DataSourceType): Promise<Array<{ title: string; value: string }>> => {
    if (!dataSource) return [];
    const config = dataSourceConfigs[dataSource];
    if (!config) {
      console.warn("dataSourceStore: Unknown dataSource", dataSource);
      return [];
    }

    try {
      const { data } = await client.query({ 
        query: config.query, 
        fetchPolicy: 'network-only' 
      });

      if (data && data[config.dataKey]) {
        let items = data[config.dataKey];
        
        if (dataSource === DataSourceType.TEACHERS) {
          items = items.filter(
            (user: any) => user && user.roles && (user.roles.includes(UserRole.TEACHER_DIRECTIVE) || user.roles.includes(UserRole.TUTOR))
          );
        } else if (dataSource === DataSourceType.STUDENTS) {
          items = items.filter((user: any) => user && user.roles && user.roles.includes(UserRole.STUDENT));
        }

        return items.map((item: any) => {
          let title = item.name;
          if (item.firstName) {
            const nameParts = [item.firstName, item.middleName, item.lastName, item.secondLastName];
            title = nameParts.filter(part => part).join(' ');
          }
          return { title: title, value: item.id };
        });
      }
    } catch (err) {
      console.error(`Error fetching data for ${dataSource}:`, err);
    }
    return [];
  };

  const fetchOptionById = async (dataSource: DataSourceType, id: string): Promise<{ title: string; value: string } | null> => {
    if (!dataSource || !id) return null;
    const config = dataSourceConfigs[dataSource];
    if (!config || !config.singleQuery || !config.singleDataKey) {
      console.warn(`Single fetch not configured for dataSource: ${dataSource}`);
      return null;
    }

    try {
      const { data } = await client.query({
        query: config.singleQuery,
        variables: { id },
        fetchPolicy: 'cache-first',
      });

      const item = data[config.singleDataKey];
      if (item) {
        let title = item.name;
        if (item.firstName) {
          const nameParts = [item.firstName, item.middleName, item.lastName, item.secondLastName];
          title = nameParts.filter(part => part).join(' ');
        }
        return { title, value: item.id };
      }
    } catch (err) {
      console.error(`Error fetching single item for ${dataSource} with id ${id}:`, err);
    }
    return null;
  };

  return {
    fetchFormattedOptions,
    fetchOptionById,
  };
});