<template>
  <v-autocomplete
    v-model="selectedItem"
    :items="items"
    :loading="loading"
    :search-input.sync="search"
    :label="label"
    item-title="name"
    item-value="_id"
    hide-no-data
    hide-details
    clearable
    return-object
    @update:model-value="onItemSelected"
  ></v-autocomplete>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/authStore';
import { useInstitutionStore } from '~/stores/institutionStore'; // Import institution store

const props = defineProps({
  specificType: { // Changed from dataSource to specificType
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

const authStore = useAuthStore();
const institutionStore = useInstitutionStore(); // Initialize institution store
const items = ref<any[]>([]);
const loading = ref(false);
const search = ref('');
const selectedItem = ref<any>(props.modelValue);

const fetchItems = async (query: string) => {
  loading.value = true;
  try {
    const { public: { GQL_HOST } } = useRuntimeConfig();
    let graphqlQuery = '';
    let variables: any = {};
    let dataPath: string = '';

    switch (props.specificType) { // Changed from dataSource to specificType
      case 'institution': // Changed from 'institutions' to 'institution'
        graphqlQuery = `
          query Institutions($search: String) {
            institutions(search: $search) {
              _id
              name
            }
          }
        `;
        variables = { search: query };
        dataPath = 'institutions';
        break;
      case 'teacher': // Assuming 'teacher' as specificType
        graphqlQuery = `
          query Users($search: String, $role: String) {
            users(search: $search, role: $role) {
              _id
              name
            }
          }
        `;
        variables = { search: query, role: 'teacher_directive' };
        dataPath = 'users';
        break;
      case 'student': // Assuming 'student' as specificType
        graphqlQuery = `
          query Users($search: String, $role: String) {
            users(search: $search, role: $role) {
              _id
              name
            }
          }
        `;
        variables = { search: query, role: 'student' };
        dataPath = 'users';
        break;
      case 'course': // Assuming 'course' as specificType
        graphqlQuery = `
          query Courses($search: String) {
            courses(search: $search) {
              _id
              name
            }
          }
        `;
        variables = { search: query };
        dataPath = 'courses';
        break;
      default:
        console.warn(`Unknown specificType: ${props.specificType}`);
        return;
    }

    const response = await fetch(GQL_HOST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables,
      }),
    });
    const data = await response.json();

    if (data.errors) {
      console.error(`Error fetching ${props.specificType}:`, data.errors);
      items.value = [];
    } else {
      items.value = data.data[dataPath] || [];
    }
  } catch (error) {
    console.error(`Failed to fetch ${props.specificType}:`, error);
    items.value = [];
  } finally {
    loading.value = false;
  }
};

watch(search, (newSearch) => {
  if (newSearch && newSearch.length > 2) { // Solo buscar si hay al menos 3 caracteres
    fetchItems(newSearch);
  } else {
    items.value = [];
  }
});

watch(() => props.modelValue, async (newValue) => {
  if (newValue && typeof newValue === 'string') {
    // If modelValue is an ID, fetch the full object
    if (props.specificType === 'institution') {
      const institution = await institutionStore.fetchInstitutionById(newValue);
      selectedItem.value = institution;
    }
    // Add other specificType cases here if needed
  } else {
    selectedItem.value = newValue;
  }
}, { immediate: true }); // Immediate to load initial value

const onItemSelected = (value: any) => {
  emit('update:modelValue', value ? value._id : null); // Emit only the ID
};

// No need for onMounted initial fetch as watch with immediate: true handles it
</script>
