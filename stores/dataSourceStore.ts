import { defineStore } from 'pinia';
import { ApolloClient, InMemoryCache, gql, from } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { createHttpLink } from '@apollo/client/link/http';
import { useAuthStore } from '~/stores/authStore';

const GQL_HOST = process.env.GQL_HOST || 'http://127.0.0.1:4000/graphql';

export const useDataSourceStore = defineStore('dataSource', () => {

  const fetchFormattedOptions = async (dataSource: string): Promise<string> => {
    if (!dataSource) return '';

    const authStore = useAuthStore();

    const httpLink = createHttpLink({
      uri: GQL_HOST,
    });

    const authLink = setContext((_, { headers }) => {
      const token = authStore.token;
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    });

    const client = new ApolloClient({
      link: from([authLink, httpLink]),
      cache: new InMemoryCache(),
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
