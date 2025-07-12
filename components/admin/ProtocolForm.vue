<template>
  <v-form @submit.prevent="submitForm">
    <v-text-field
      v-model="protocol.name"
      label="Nombre del Protocolo"
      :rules="[rules.required]"
      required
    ></v-text-field>
    <v-text-field
      v-model="protocol.module"
      label="Módulo"
      :rules="[rules.required]"
      required
    ></v-text-field>
    <v-select
      v-model="protocol.formIds"
      :items="forms"
      item-title="name"
      item-value="_id"
      label="Formularios Asociados"
      multiple
      chips
      clearable
    ></v-select>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" text @click="emit('cancel')">Cancelar</v-btn>
      <v-btn color="blue-darken-1" type="submit">Guardar</v-btn>
    </v-card-actions>
  </v-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  initialData: {
    type: Object,
    default: null,
  },
  forms: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['submit', 'cancel']);

const protocol = ref({
  name: '',
  module: '',
  formIds: [],
});

const rules = {
  required: (value: string) => !!value || 'Campo requerido.',
};

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      protocol.value = {
        name: newVal.name || '',
        module: newVal.module || '',
        formIds: newVal.forms ? newVal.forms.map((f: any) => f._id) : [],
      };
    } else {
      protocol.value = {
        name: '',
        module: '',
        formIds: [],
      };
    }
  },
  { immediate: true }
);

const submitForm = () => {
  emit('submit', protocol.value);
};
</script>
