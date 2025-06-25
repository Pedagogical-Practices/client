// utils/graphqlClient.ts
import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient("http://localhost:3000/graphql", {
  headers: () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

export { client as graphqlClient };
