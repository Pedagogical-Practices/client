<template>
  <v-select
    v-model="selectedValue"
    :items="items"
    :label="label"
    :loading="loading"
    :item-title="'label'"
    :item-value="'value'"
    variant="outlined"
    density="compact"
  ></v-select>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useDataSourceStore } from "~/stores/dataSourceStore";

const props = defineProps<{
  modelValue: any;
  dataSource?: string;
  label: string;
  options?: any[];
  itemTitle?: string;
  itemValue?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const loading = ref(false);
const items = ref<any[]>([]);
const selectedValue = ref(props.modelValue);
const dataSourceStore = useDataSourceStore();

watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue;
  }
);

watch(selectedValue, (newValue) => {
  emit("update:modelValue", newValue);
});

async function fetchFromDataSource() {
  if (!props.dataSource) return;
  loading.value = true;
  try {
    const formattedOptions = await dataSourceStore.fetchFormattedOptions(
      props.dataSource
    );
    console.log("DynamicSelect: formattedOptions received:", formattedOptions);

    const lines = formattedOptions.split("\n").filter((line) => line);
    if (lines.length === 1) {
      // Si solo hay una línea, asumimos que es un valor preseleccionado
      const parts = lines[0].split("|");
      selectedValue.value = parts[0]; // Establecer el valor preseleccionado
      items.value = [{ value: parts[0], label: parts[1] }]; // Asegurar que el item esté en la lista
    } else {
      items.value = lines.map((line) => {
        const parts = line.split("|");
        return { value: parts[0], label: parts[1] };
      });
    }
    console.log("DynamicSelect: items after parsing:", items.value);
  } catch (error) {
    console.error(`Error fetching data for ${props.dataSource}:`, error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  console.log("DynamicSelect mounted with props:", props);
  if (props.dataSource) {
    fetchFromDataSource();
  } else if (props.options) {
    items.value = props.options;
  }
});
</script>
