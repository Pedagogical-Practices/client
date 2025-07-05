import { defineStore } from 'pinia';
import { gql } from 'graphql-tag'; // Use graphql-tag for gql

// Note: We are NOT calling useAsyncQuery inside the store action directly.
// Instead, this store becomes a utility that other components or services
// (which ARE in the Nuxt context) can use.
// However, a better approach is to call useAsyncQuery directly from the component
// that needs the data. This store might be a candidate for deprecation.

// For now, let's make it work by assuming the caller has context.

export const useDataSourceStore = defineStore('dataSource', () => {

  const fetchFormattedOptions = async (dataSource: string): Promise<string> => {
    if (!dataSource) return '';

    // Construct the query dynamically
    // IMPORTANT: The query name must be unique. Using the dataSource name is a good strategy.
    const query = gql`query Get${dataSource.charAt(0).toUpperCase() + dataSource.slice(1)} { ${dataSource} { _id name } }`;

    try {
      // useAsyncQuery is the modern way to fetch data with @nuxtjs/apollo
      const { data, error } = await useAsyncQuery(query);

      if (error.value) {
        throw error.value;
      }

      if (data.value && data.value[dataSource]) {
        return data.value[dataSource].map((item: any) => `${item._id}|${item.name}`).join('\n');
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