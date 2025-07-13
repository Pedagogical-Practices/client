import { defineStore } from "pinia";
import { gql } from "graphql-tag";
import { useApolloClient } from "@vue/apollo-composable";

export const useDataSourceStore = defineStore("dataSource", () => {
  const { client } = useApolloClient();

  const fetchFormattedOptions = async (dataSource: string): Promise<string> => {
    console.log(
      "dataSourceStore: fetchFormattedOptions called with",
      dataSource
    );
    if (!dataSource) return "";

    let query;
    let dataKey = dataSource;

    if (dataSource === "teachers" || dataSource === "students") {
      query = gql`
        query GetUsers {
          users {
            _id
            name
            role
          }
        }
      `;
      dataKey = "users";
    } else {
      const queryName =
        dataSource.charAt(0).toUpperCase() + dataSource.slice(1);
      query = gql`query Get${queryName} { ${dataSource} { _id name } }`;
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
            (user: any) => user.role === "teacher_directive"
          );
        } else if (dataSource === "students") {
          items = items.filter((user: any) => user.role === "student");
        }
        const formatted = items
          .map((item: any) => `${item._id}|${item.name}`)
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
