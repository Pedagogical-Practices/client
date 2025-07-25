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
import { gql } from 'graphql-tag';

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

const fetchItems = async (query: string) => {
  loading.value = true;
  try {
    let graphqlQuery = '';
    let variables: any = {};
    let dataPath: string = '';

    switch (props.specificType) {
      case 'teacher':
        graphqlQuery = `
          query Users($search: String, $role: UserRole) {
            users(search: $search, role: $role) {
              id
              name
            }
          }
        `;
        variables = { search: query, role: 'TEACHER_DIRECTIVE' };
        dataPath = 'users';
        break;
      case 'student':
        graphqlQuery = `
          query Users($search: String, $role: UserRole) {
            users(search: $search, role: $role) {
              id
              name
            }
          }
        `;
        variables = { search: query, role: 'STUDENT' };
        dataPath = 'users';
        break;
      case 'course':
        graphqlQuery = `
          query Courses($search: String) {
            courses(search: $search) {
              id
              name
            }
          }
        `;
        variables = { search: query };
        dataPath = 'courses';
        break;
      case 'protocol':
        graphqlQuery = `
          query Protocols($search: String) {
            protocols(search: $search) {
              id
              name
            }
          }
        `;
        variables = { search: query };
        dataPath = 'protocols';
        break;
      case 'form':
        graphqlQuery = `
          query Forms($search: String) {
            forms(search: $search) {
              id
              name
            }
          }
        `;
        variables = { search: query };
        dataPath = 'forms';
        break;
      default:
        console.warn(`Unknown specificType: ${props.specificType}`);
        return;
    }

    const { data, errors } = await apolloClient.query({
      query: gql(graphqlQuery),
      variables,
      fetchPolicy: 'network-only',
    });

    if (errors) {
      console.error(`Error fetching ${props.specificType}:`, errors);
      items.value = [];
    } else {
      items.value = data[dataPath] || [];
    }
  } catch (error) {
    console.error(`Failed to fetch ${props.specificType}:`, error);
    items.value = [];
  } finally {
    loading.value = false;
  }
};

watch(search, (newSearch) => {
  if (newSearch && newSearch.length > 2) {
    fetchItems(newSearch);
  } else {
    items.value = [];
  }
});

watch(() => props.modelValue, async (newValue) => {
  if (newValue && typeof newValue === 'string') {
    // If modelValue is an ID, fetch the full object
    let fetchedItem: any = null;
    if (props.specificType === 'teacher' || props.specificType === 'student') {
      const { data } = await apolloClient.query({ query: gql`query User($id: ID!) { user(id: $id) { id name } }`, variables: { id: newValue } });
      fetchedItem = data?.user;
    } else if (props.specificType === 'course') {
      const { data } = await apolloClient.query({ query: gql`query Course($id: ID!) { course(id: $id) { id name } }`, variables: { id: newValue } });
      fetchedItem = data?.course;
    } else if (props.specificType === 'protocol') {
      const { data } = await apolloClient.query({ query: gql`query Protocol($id: ID!) { protocol(id: $id) { id name } }`, variables: { id: newValue } });
      fetchedItem = data?.protocol;
    } else if (props.specificType === 'form') {
      const { data } = await apolloClient.query({ query: gql`query Form($id: ID!) { form(id: $id) { id name } }`, variables: { id: newValue } });
      fetchedItem = data?.form;
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
