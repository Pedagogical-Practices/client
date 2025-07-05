import { defineStore } from 'pinia';
import { gql } from 'graphql-tag';
import { useApolloClient } from '@vue/apollo-composable';

export const useDataSourceStore = defineStore('dataSource', () => {
  const { client } = useApolloClient();

  const fetchFormattedOptions = async (dataSource: string): Promise<string> => {
    if (!dataSource) return '';

    let query;
    let dataKey = dataSource; // The key under which the data array is returned

    if (dataSource === 'teachers' || dataSource === 'students') {
      query = gql`query GetUsers { users { _id name role } }`;
      dataKey = 'users';
    } else {
      const queryName = dataSource.charAt(0).toUpperCase() + dataSource.slice(1);
      query = gql`query Get${queryName} { ${dataSource} { _id name } }`;
    }

    try {
      const { data, errors } = await client.query({ query });

      if (errors) {
        throw new Error(errors.map(e => e.message).join(', '));
      }

      if (data && data[dataKey]) {
        let items = data[dataKey];
        if (dataSource === 'teachers') {
          items = items.filter((user: any) => user.role === 'teacher');
        } else if (dataSource === 'students') {
          items = items.filter((user: any) => user.role === 'student');
        }
        return items.map((item: any) => `${item._id}|${item.name}`).join('\n');
      }

    } catch (err) {
      console.error(`Error fetching data for ${dataSource}:`, err);
    }

    return '';
  };

  return {
    fetchFormattedOptions,
  };
});