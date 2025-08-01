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
              name
              role
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
              name
              role
            }
          }
        `;
        variables = {};
        dataPath = "users";
        break;
      case "course":
        graphqlQuery = `
          query Courses {
            courses {
              id
              name
            }
          }
        `;
        variables = {};
        dataPath = "courses";
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
          console.log(
            `EntityAutocomplete: User role for teacher filter: ${user.role}`
          ); // NEW LOG
          return user.role === "TEACHER_DIRECTIVE";
        });
      } else if (props.specificType === "student") {
        fetchedItems = fetchedItems.filter((user: any) => {
          console.log(
            `EntityAutocomplete: User role for student filter: ${user.role}`
          ); // NEW LOG
          return user.role === "STUDENT";
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

watch(
  () => props.modelValue,
  async (newValue) => {
    console.log(
      `EntityAutocomplete: modelValue changed for ${props.specificType}:`,
      newValue
    );
    if (props.multiple) {
      if (Array.isArray(newValue) && newValue.length > 0) {
        let fetchedItems: any[] = [];
        if (props.specificType === "protocol") {
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
            fetchPolicy: "network-only", // Ensure fresh data
          });
          fetchedItems = data?.protocolsByIds || [];
        }
        selectedItem.value = fetchedItems;
        console.log(
          "EntityAutocomplete: selectedItem after fetch (multiple):",
          selectedItem.value
        ); // NEW LOG
      } else {
        selectedItem.value = [];
      }
    } else {
      if (newValue && typeof newValue === "string") {
        let fetchedItem: any = null;
        if (
          props.specificType === "teacher" ||
          props.specificType === "student"
        ) {
          const { data } = await apolloClient.query({
            query: gql`
              query User($id: ID!) {
                user(id: $id) {
                  id
                  name
                }
              }
            `,
            variables: { id: newValue },
          });
          fetchedItem = data?.user;
        } else if (props.specificType === "course") {
          const { data } = await apolloClient.query({
            query: gql`
              query Course($id: ID!) {
                course(id: $id) {
                  id
                  name
                }
              }
            `,
            variables: { id: newValue },
          });
          fetchedItem = data?.course;
        } else if (props.specificType === "protocol") {
          const { data } = await apolloClient.query({
            query: gql`
              query Protocol($id: ID!) {
                protocol(id: $id) {
                  id
                  name
                }
              }
            `,
            variables: { id: newValue },
          });
          fetchedItem = data?.protocol;
        } else if (props.specificType === "form") {
          const { data } = await apolloClient.query({
            query: gql`
              query Form($id: ID!) {
                form(id: $id) {
                  id
                  name
                }
              }
            `,
            variables: { id: newValue },
          });
          fetchedItem = data?.form;
        }
        selectedItem.value = fetchedItem;
      } else {
        selectedItem.value = newValue;
      }
      console.log("fetchedItem:", selectedItem.value);
    }
  },
  { immediate: true }
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
