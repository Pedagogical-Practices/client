import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

// Importar las consultas GraphQL
import UsersCountQuery from '~/queries/usersCount.gql?raw';
import PracticesCountQuery from '~/queries/practicesCount.gql?raw';
import ProtocolsCountQuery from '~/queries/protocolsCount.gql?raw';
import FormsCountQuery from '~/queries/formsCount.gql?raw';

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
      const { $gqlClient } = useNuxtApp();

      try {
        const [usersCountData, practicesCountData, protocolsCountData, formsCountData] = await Promise.all([
          client.query({ query: UsersCountQuery }),
          client.query({ query: PracticesCountQuery }),
          client.query({ query: ProtocolsCountQuery }),
          client.query({ query: FormsCountQuery }),
        ]);

        this.usersCount = usersCountData.data.usersCount;
        this.practicesCount = practicesCountData.data.practicesCount;
        this.protocolsCount = protocolsCountData.data.protocolsCount;
        this.formsCount = formsCountData.data.formsCount;

      } catch (err: any) {
        this.error = err.message || 'Failed to fetch dashboard data.';
        console.error('Dashboard Store Error:', err);
      } finally {
        this.loading = false;
      }
    },
  },
});