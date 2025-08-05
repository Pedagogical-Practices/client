import { defineStore } from "pinia";
import { ref } from "vue";
import { useApolloClient } from "@vue/apollo-composable";

// Importar queries GraphQL
import GetUsers from "~/queries/getUsers.gql";
import GetGroups from "~/queries/groups.gql";
import GetProtocols from "~/queries/protocols.gql";
import GetForms from "~/queries/forms.gql";

export const useDashboardStore = defineStore("dashboard", () => {
  const { client: apolloClient } = useApolloClient();

  // State
  const usersCount = ref<number | null>(null);
  const groupsCount = ref<number | null>(null);
  const protocolsCount = ref<number | null>(null);
  const formsCount = ref<number | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  const fetchAdminCoordinatorDashboardData = async () => {
    loading.value = true;
    error.value = null;
    try {
      const [usersRes, groupsRes, protocolsRes, formsRes] =
        await Promise.all([
          apolloClient.query({ query: GetUsers, fetchPolicy: "network-only" }),
          apolloClient.query({ query: GetGroups, fetchPolicy: "network-only" }),
          apolloClient.query({
            query: GetProtocols,
            fetchPolicy: "network-only",
          }),
          apolloClient.query({ query: GetForms, fetchPolicy: "network-only" }),
        ]);

      if (usersRes.errors) throw usersRes.errors;
      if (groupsRes.errors) throw groupsRes.errors;
      if (protocolsRes.errors) throw protocolsRes.errors;
      if (formsRes.errors) throw formsRes.errors;

      usersCount.value = usersRes.data.users.length;
      groupsCount.value = groupsRes.data.groups.length;
      protocolsCount.value = protocolsRes.data.protocols.length;
      formsCount.value = formsRes.data.forms.length;
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      error.value =
        err.message || "Error desconocido al cargar datos del dashboard.";
    } finally {
      loading.value = false;
    }
  };

  return {
    usersCount,
    groupsCount,
    protocolsCount,
    formsCount,
    loading,
    error,
    fetchAdminCoordinatorDashboardData,
  };
});
