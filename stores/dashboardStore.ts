import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';
import { useRuntimeConfig } from '#app';

// Importar las consultas GraphQL
import UsersCountQuery from '@/queries/usersCount.gql?raw';
import PracticesCountQuery from '@/queries/practicesCount.gql?raw';
import ProtocolsCountQuery from '@/queries/protocolsCount.gql?raw';
import FormsCountQuery from '@/queries/formsCount.gql?raw';

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
      const authStore = useAuthStore();
      const { public: { GQL_HOST } } = useRuntimeConfig();

      if (!authStore.token) {
        this.error = 'No authentication token found.';
        this.loading = false;
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      };

      try {
        // Fetch Users Count
        const usersCountResponse = await fetch(GQL_HOST, {
          method: 'POST',
          headers,
          body: JSON.stringify({ query: UsersCountQuery }),
        });
        const usersCountData = await usersCountResponse.json();
        if (usersCountData.errors) {
          throw new Error(usersCountData.errors[0]?.message || 'Error fetching users count');
        }
        this.usersCount = usersCountData.data.usersCount;

        // Fetch Practices Count
        const practicesCountResponse = await fetch(GQL_HOST, {
          method: 'POST',
          headers,
          body: JSON.stringify({ query: PracticesCountQuery }),
        });
        const practicesCountData = await practicesCountResponse.json();
        if (practicesCountData.errors) {
          throw new Error(practicesCountData.errors[0]?.message || 'Error fetching practices count');
        }
        this.practicesCount = practicesCountData.data.practicesCount;

        // Fetch Protocols Count
        const protocolsCountResponse = await fetch(GQL_HOST, {
          method: 'POST',
          headers,
          body: JSON.stringify({ query: ProtocolsCountQuery }),
        });
        const protocolsCountData = await protocolsCountResponse.json();
        if (protocolsCountData.errors) {
          throw new Error(protocolsCountData.errors[0]?.message || 'Error fetching protocols count');
        }
        this.protocolsCount = protocolsCountData.data.protocolsCount;

        // Fetch Forms Count
        const formsCountResponse = await fetch(GQL_HOST, {
          method: 'POST',
          headers,
          body: JSON.stringify({ query: FormsCountQuery }),
        });
        const formsCountData = await formsCountResponse.json();
        if (formsCountData.errors) {
          throw new Error(formsCountData.errors[0]?.message || 'Error fetching forms count');
        }
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
