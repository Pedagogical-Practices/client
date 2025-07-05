import { defineStore } from 'pinia';

// Importar las consultas GraphQL
import UsersCountQuery from '~/queries/usersCount.gql';
import PracticesCountQuery from '~/queries/practicesCount.gql';
import ProtocolsCountQuery from '~/queries/protocolsCount.gql';
import FormsCountQuery from '~/queries/formsCount.gql';

interface DashboardState {
  usersCount: number | null;
  practicesCount: number | null;
  protocolsCount: number | null;
  formsCount: number | null;
  loading: boolean;
  error: string | null;
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    usersCount: null,
    practicesCount: null,
    protocolsCount: null,
    formsCount: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAdminCoordinatorDashboardData() {
      this.loading = true;
      this.error = null;

      try {
        // We use useAsyncQuery for each piece of data.
        // This will also cache the results.
        const [usersCountResult, practicesCountResult, protocolsCountResult, formsCountResult] = await Promise.all([
          useAsyncQuery(UsersCountQuery),
          useAsyncQuery(PracticesCountQuery),
          useAsyncQuery(ProtocolsCountQuery),
          useAsyncQuery(FormsCountQuery),
        ]);

        if (usersCountResult.error.value) throw usersCountResult.error.value;
        this.usersCount = usersCountResult.data.value?.usersCount;

        if (practicesCountResult.error.value) throw practicesCountResult.error.value;
        this.practicesCount = practicesCountResult.data.value?.practicesCount;

        if (protocolsCountResult.error.value) throw protocolsCountResult.error.value;
        this.protocolsCount = protocolsCountResult.data.value?.protocolsCount;

        if (formsCountResult.error.value) throw formsCountResult.error.value;
        this.formsCount = formsCountResult.data.value?.formsCount;

      } catch (err: any) {
        this.error = err.message || 'Failed to fetch dashboard data.';
        console.error('Dashboard Store Error:', err);
      } finally {
        this.loading = false;
      }
    },
  },
});