import { defineStore } from 'pinia';
import { Gql } from '#graphql-client'; // Importa la instancia global de Gql
import { gql } from '@apollo/client/core';

export const useDataSourceStore = defineStore('dataSource', () => {
  const client = Gql().client;

  const fetchFormattedOptions = async (dataSource: string): Promise<string> => {
    if (!dataSource) return '';
    try {
      const query = gql`query ${dataSource} { ${dataSource} { _id name } }`;
      const { data } = await client.query({ query });

      if (data && data[dataSource]) {
        return data[dataSource].map((item: any) => `${item._id}|${item.name}`).join('\n');
      }
    } catch (error) {
      console.error(`Error fetching data for ${dataSource}:`, error);
    }
    return '';
  };

  return {
    fetchFormattedOptions,
  };
});
    try {
      const query = gql`query ${dataSource} { ${dataSource} { _id name } }`;
      const { data } = await client.query({ query });

      if (data && data[dataSource]) {
        return data[dataSource].map((item: any) => `${item._id}|${item.name}`).join('\n');
      }
    }
    catch (error) {
      console.error(`Error fetching data for ${dataSource}:`, error);
    }
    return '';
  };

  return {
    fetchFormattedOptions,
  };
});
