import { defineStore } from "pinia";
import { gql } from "graphql-tag";
import { useApolloClient } from "@vue/apollo-composable";
import { useAuthStore } from "~/stores/authStore"; // Importar authStore
import { usePracticeStore } from "~/stores/practiceStore"; // Importar practiceStore

export const useDataSourceStore = defineStore("dataSource", () => {
  const { client } = useApolloClient();
  const authStore = useAuthStore(); // Inicializar authStore
  const practiceStore = usePracticeStore(); // Inicializar practiceStore

  const fetchFormattedOptions = async (dataSource: string): Promise<string> => {
    console.log(
      "dataSourceStore: fetchFormattedOptions called with",
      dataSource
    );
    if (!dataSource) return "";

    let query;
    let dataKey = dataSource;

    // Lógica para autocompletar estudiante e institución
    if (dataSource === "students") {
      if (authStore.user?.role === "student") {
        // Autocompletar con el estudiante logueado
        const studentName = authStore.user.name || authStore.user.email;
        return `${authStore.user._id}|${studentName}`; // Formato ID|Nombre
      }
      // Si no es el estudiante logueado, procede a buscar todos los estudiantes
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
    } else if (dataSource === "institutions") {
      if (practiceStore.currentPractice?.institutionName) {
        // Autocompletar con la institución de la práctica actual
        // Asumimos que el ID de la institución no es necesario para el autocompletado inicial
        // y que el nombre es suficiente para la visualización.
        // Si se necesita el ID, habría que buscar la institución por nombre en el backend.
        return `|${practiceStore.currentPractice.institutionName}`; // Formato ID|Nombre (ID vacío si no se tiene)
      }
      // Si no hay institución en la práctica actual, procede a buscar todas las instituciones
      const queryName =
        dataSource.charAt(0).toUpperCase() + dataSource.slice(1);
      query = gql`query Get${queryName} { ${dataSource} { _id name } }`;
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
    }
 catch (err) {
      console.error(`Error fetching data for ${dataSource}:`, err);
    }

    console.log("dataSourceStore: Returning empty string");
    return "";
  };

  return {
    fetchFormattedOptions,
  };
});
