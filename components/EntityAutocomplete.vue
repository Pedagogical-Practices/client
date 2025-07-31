<template>
  <v-autocomplete
    v-model="selectedItem"
    :items="items"
    :loading="loading"
    :search-input.sync="search"
    :label="label"
    item-title="name"
    item-value="id"
    hide-no-data
    hide-details
    clearable
    return-object
    @update:model-value="onItemSelected"
  ></v-autocomplete>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useApolloClient } from '@vue/apollo-composable';
import { UserRole } from '~/types';

// Importar las queries
import GetUsersAutocomplete from '~/queries/entityAutocomplete/getUsersAutocomplete.gql';
import GetCoursesAutocomplete from '~/queries/entityAutocomplete/getCoursesAutocomplete.gql';
import GetProtocolsAutocomplete from '~/queries/entityAutocomplete/getProtocolsAutocomplete.gql';
import GetFormsAutocomplete from '~/queries/entityAutocomplete/getFormsAutocomplete.gql';

interface EntityConfig {
  query: any;
  dataPath: string;
  role?: UserRole;
}

const entityConfigs: Record<string, EntityConfig> = {
  teacher: { query: GetUsersAutocomplete, dataPath: 'users', role: UserRole.TEACHER_DIRECTIVE },
  student: { query: GetUsersAutocomplete, dataPath: 'users', role: UserRole.STUDENT },
  course: { query: GetCoursesAutocomplete, dataPath: 'courses' },
  protocol: { query: GetProtocolsAutocomplete, dataPath: 'protocols' },
  form: { query: GetFormsAutocomplete, dataPath: 'forms' },
};

const props = defineProps({
  specificType: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: 'Seleccionar',
  },
  modelValue: {
    type: [String, Object],
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const { client: apolloClient } = useApolloClient();
const items = ref<any[]>([]);
const loading = ref(false);
const search = ref('');
const selectedItem = ref<any>(props.modelValue);

const fetchItems = async (searchQuery: string) => {
  loading.value = true;
  try {
    const config = entityConfigs[props.specificType];
    if (!config) {
      console.warn(`Unknown specificType: ${props.specificType}`);
      items.value = [];
      return;
    }

    const variables: any = { search: searchQuery };
    if (config.role) {
      variables.role = config.role;
    }

    const { data, errors } = await apolloClient.query({
      query: config.query,
      variables,
      fetchPolicy: 'network-only',
    });

    if (errors) {
      console.error(`Error fetching ${props.specificType}:`, errors);
      items.value = [];
    } else {
      items.value = data[config.dataPath] || [];
    }
  } catch (error) {
    console.error(`Failed to fetch ${props.specificType}:`, error);
    items.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchItems(''); // Cargar todos los elementos al inicio
});

watch(search, (newSearch) => {
  // Solo buscar si hay más de 2 caracteres o si la búsqueda está vacía (para resetear)
  if (newSearch === '' || newSearch.length > 2) {
    fetchItems(newSearch);
  }
});

watch(() => props.modelValue, async (newValue) => {
  if (newValue && typeof newValue === 'string') {
    // Si modelValue es un ID, buscar el objeto completo
    let fetchedItem: any = null;
    const config = entityConfigs[props.specificType];
    if (config) {
      const { data } = await apolloClient.query({
        query: config.query,
        variables: { id: newValue },
        fetchPolicy: 'network-only',
      });
      fetchedItem = data[config.dataPath]?.[0]; // Asumiendo que la query devuelve un array y tomamos el primero
    }
    selectedItem.value = fetchedItem;
  } else {
    selectedItem.value = newValue;
  }
}, { immediate: true });

const onItemSelected = (value: any) => {
  emit('update:modelValue', value ? value.id : null);
};
</script>
