<template>
  <v-autocomplete
    v-model="selectedItem"
    :items="processedItems"
    :loading="loading"
    :search-input.sync="search"
    :label="label"
    item-title="name"
    item-value="id"
    hide-no-data
    hide-details
    :multiple="multiple"
    :chips="multiple"
    :clearable="multiple"
    return-object
    @update:model-value="onItemSelected"
    class="mb-4"
    variant="outlined"
  ></v-autocomplete>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { gql } from "graphql-tag";

const props = defineProps({
  specificType: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: "Seleccionar",
  },
  modelValue: {
    type: [String, Object, Array],
    default: null,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const { client: apolloClient } = useApolloClient();
const items = ref<any[]>([]);
const loading = ref(false);
const search = ref("");
const selectedItem = ref<any>(props.modelValue);

const processedItems = computed(() => {
  if (props.specificType === 'teacher' || props.specificType === 'student') {
    return items.value.map(user => {
      const mutableUser = Object.assign({}, user);
      mutableUser.name = `${mutableUser.firstName} ${mutableUser.lastName}`;
      return mutableUser;
    });
  }
  return items.value;
});

const fetchItems = async (query: string) => {
  loading.value = true;
  try {
    let graphqlQuery = "";
    let variables: any = {};
    let dataPath: string = "";

    switch (props.specificType) {
      case "teacher":
        graphqlQuery = `
          query Users {
            users {
              id
              firstName
              lastName
              roles
            }
          }
        `;
        variables = {};
        dataPath = "users";
        break;
      case "student":
        graphqlQuery = `
          query Users {
            users {
              id
              firstName
              lastName
              roles
            }
          }
        `;
        variables = {};
        dataPath = "users";
        break;
      case "practice":
        graphqlQuery = `
          query Practices {
            practices {
              id
              name
            }
          }
        `;
        variables = {};
        dataPath = "practices";
        break;
      case "protocol":
        graphqlQuery = `
          query Protocols {
            protocols {
              id
              name
            }
          }
        `;
        variables = {};
        dataPath = "protocols";
        console.log(
          "EntityAutocomplete: Fetching protocols with query:",
          graphqlQuery
        );
        console.log("EntityAutocomplete: Variables:", variables);
        break;
      case "form":
        graphqlQuery = `
          query Forms($search: String) {
            forms(search: $search) {
              id
              name
            }
          }
        `;
        variables = { search: query };
        dataPath = "forms";
        break;
      default:
        console.warn(`Unknown specificType: ${props.specificType}`);
        return;
    }

    const { data, errors } = await apolloClient.query({
      query: gql(graphqlQuery),
      variables,
      fetchPolicy: "network-only",
    });

    if (errors) {
      console.error(
        `EntityAutocomplete: GraphQL errors for ${props.specificType}:`,
        errors
      );
      items.value = [];
    } else {
      console.log(
        `EntityAutocomplete: Data received for ${props.specificType}:`,
        data
      );
      let fetchedItems = data[dataPath] || [];
      console.log(
        `EntityAutocomplete: Raw fetchedItems for ${props.specificType}:`,
        fetchedItems
      ); // NEW LOG
      if (props.specificType === "teacher") {
        fetchedItems = fetchedItems.filter((user: any) => {
          return user.roles.includes("TUTOR");
        });
      } else if (props.specificType === "student") {
        fetchedItems = fetchedItems.filter((user: any) => {
          return user.roles.includes("STUDENT");
        });
      }
      items.value = fetchedItems;
      console.log(
        `EntityAutocomplete: Items set for ${props.specificType}:`,
        items.value
      );
    }
    console.log(
      `EntityAutocomplete: Fetch completed for ${props.specificType}. Items:`,
      items.value
    );
  } catch (error) {
    console.error(`Failed to fetch ${props.specificType}:`, error);
    items.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchItems(""); // Cargar ítems al montar el componente
});

import UsersByIdsQuery from '~/queries/usersByIds.gql';

watch(
  () => props.modelValue,
  async (newValue) => {
    if (props.multiple) {
      if (Array.isArray(newValue) && newValue.length > 0) {
        let fetchedItems: any[] = [];
        if (props.specificType === 'student' || props.specificType === 'teacher') {
          const { data } = await apolloClient.query({
            query: UsersByIdsQuery,
            variables: { ids: newValue },
            fetchPolicy: 'network-only',
          });
          fetchedItems = data?.usersByIds || [];
        } else if (props.specificType === 'protocol') {
          // Existing logic for protocols
          const { data } = await apolloClient.query({
            query: gql`
              query ProtocolsByIds($ids: [ID!]!) {
                protocolsByIds(ids: $ids) {
                  id
                  name
                }
              }
            `,
            variables: { ids: newValue },
            fetchPolicy: 'network-only',
          });
          fetchedItems = data?.protocolsByIds || [];
        }
        // Process items to add the name property for display
        selectedItem.value = fetchedItems.map(item => {
          const mutableItem = Object.assign({}, item);
          if (mutableItem.firstName && mutableItem.lastName) {
            mutableItem.name = `${mutableItem.firstName} ${mutableItem.lastName}`;
          }
          return mutableItem;
        });
      } else {
        selectedItem.value = [];
      }
    } else {
      if (newValue && typeof newValue === 'string') {
        let fetchedItem: any = null;
        if (props.specificType === 'teacher' || props.specificType === 'student') {
          const { data } = await apolloClient.query({
            query: gql`
              query User($id: ID!) {
                user(id: $id) {
                  id
                  firstName
                  lastName
                }
              }
            `,
            variables: { id: newValue },
          });
          fetchedItem = data?.user;
          if (fetchedItem) {
            fetchedItem.name = `${fetchedItem.firstName} ${fetchedItem.lastName}`;
          }
        } else if (props.specificType === 'practice') {
          // ... other types
        }
        selectedItem.value = fetchedItem;
      } else {
        selectedItem.value = newValue;
      }
    }
  },
  { immediate: true, deep: true }
);

const onItemSelected = (value: any) => {
  console.log("EntityAutocomplete: onItemSelected value:", value); // NEW LOG
  if (props.multiple) {
    const emittedValue = value ? value.map((item: any) => item.id) : [];
    console.log("EntityAutocomplete: Emitting (multiple):", emittedValue); // NEW LOG
    emit("update:modelValue", emittedValue);
  } else {
    const emittedValue = value ? value.id : null;
    console.log("EntityAutocomplete: Emitting (single):", emittedValue); // NEW LOG
    emit("update:modelValue", emittedValue);
  }
};
</script>
