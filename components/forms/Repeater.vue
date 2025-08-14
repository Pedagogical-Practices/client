<template>
  <div class="repeater-container">
    <div>
      <p>{{ label }}</p>
      <v-btn color="primary" @click="addItem" prepend-icon="mdi-plus"
        >Agregar campos</v-btn
      >
    </div>
    <div
      v-for="(item, index) in localValue"
      :key="index"
      class="repeater-item my-2 pa-1 rounded"
    >
      <!--v-row dense>
        <v-col cols="8" class="d-flex justify-end">
          <v-btn color="primary" @click="addItem" icon="mdi-plus"></v-btn>
        </v-col>
      </v-row-->
      <v-row dense>
        <v-col
          v-for="subField in options"
          :key="subField.name"
          cols="12"
          md="5"
        >
          <v-text-field
            v-if="subField.type === 'TEXT'"
            v-model="item[subField.name]"
            :label="subField.label"
            :type="subField.specificType || 'text'"
            density="compact"
            variant="outlined"
          ></v-text-field>
          <!-- Add other sub-field types here as needed, e.g., VSelect -->
        </v-col>
        <v-col cols="2" md="2" class="d-flex align-center pb-6">
          <v-btn
            icon="mdi-delete"
            color="error"
            variant="text"
            @click="removeItem(index)"
          ></v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { VTextField, VSelect } from "vuetify/components";

const props = defineProps<{
  label: string;
  modelValue: any[];
  options: {
    name: string;
    label: string;
    type: string;
    specificType?: string;
  }[];
}>();

const emit = defineEmits(["update:modelValue"]);

const localValue = ref<any[]>([]);

watch(
  () => props.modelValue,
  (newValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(localValue.value)) {
      localValue.value = JSON.parse(JSON.stringify(newValue || []));
    }
  },
  { immediate: true, deep: true }
);

watch(
  localValue,
  (newValue) => {
    emit("update:modelValue", newValue);
  },
  { deep: true }
);

const createEmptyItem = () => {
  const emptyItem: Record<string, any> = {};
  props.options.forEach((subField) => {
    emptyItem[subField.name] = null;
  });
  return emptyItem;
};

const addItem = () => {
  localValue.value.push(createEmptyItem());
};

const removeItem = (index: number) => {
  localValue.value.splice(index, 1);
};
</script>

<style scoped>
.repeater-container {
  padding: 12px;
  border: 1px solid #fff;
  border-radius: 4px;
}
.repeater-item {
  background-color: #fff;
}
</style>
