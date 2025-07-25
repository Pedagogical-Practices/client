<template>
  <v-form @submit.prevent="submitForm">
    <v-text-field
      v-model="protocol.name"
      label="Nombre del Protocolo"
      :rules="[rules.required]"
      required
    ></v-text-field>
    <EntityAutocomplete
      v-model="protocol.formId"
      specific-type="form"
      label="Formulario Asociado"
      required
    ></EntityAutocomplete>
    <v-text-field
      v-model="protocol.productType"
      label="Tipo de Producto"
      hint="Ej: INFORME_MAPEO, RECURSO_DIGITAL"
      persistent-hint
    ></v-text-field>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" text @click="emit('cancel')">Cancelar</v-btn>
      <v-btn color="blue-darken-1" type="submit">Guardar</v-btn>
    </v-card-actions>
  </v-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import EntityAutocomplete from '~/components/EntityAutocomplete.vue';

const props = defineProps({
  initialData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const protocol = ref({
  name: '',
  description: '',
  formId: '',
  productType: '',
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
        description: newVal.description || '',
        formId: newVal.form?.id || '',
        productType: newVal.productType || '',
      };
    } else {
      protocol.value = {
        name: '',
        description: '',
        formId: '',
        productType: '',
      };
    }
  },
  { immediate: true }
);

const submitForm = () => {
  emit('submit', protocol.value);
};
</script>
