import { defineStore } from 'pinia';
import { gql } from 'graphql-tag';
import { useApolloClient } from '@vue/apollo-composable';

export const useDataSourceStore = defineStore('dataSource', () => {
  const { client } = useApolloClient();

  const fetchFormattedOptions = async (dataSource: string): Promise<string> => {
    if (!dataSource) return '';

    const query = gql`query Get${dataSource.charAt(0).toUpperCase() + dataSource.slice(1)} { ${dataSource} { _id name } }`;

    try {
      const { data, errors } = await client.query({ query });

      if (errors) {
        throw new Error(errors.map(e => e.message).join(', '));
      }

      if (data && data[dataSource]) {
        return data[dataSource].map((item: any) => `${item._id}|${item.name}`).join('\n');
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