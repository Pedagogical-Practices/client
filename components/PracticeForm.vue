<template>
  <v-card>
    <v-card-title>{{ isEditMode ? 'Editar Práctica' : 'Asignar Nueva Práctica' }}</v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-select
          v-model="practice.studentId"
          :items="students"
          item-title="name"
          item-value="_id"
          label="Estudiante"
          variant="outlined"
          density="compact"
          required
        ></v-select>
        <v-select
          v-model="practice.advisorId"
          :items="advisors"
          item-title="name"
          item-value="_id"
          label="Docente Asesor"
          variant="outlined"
          density="compact"
          required
        ></v-select>
        <v-select
          v-model="practice.protocolId"
          :items="protocols"
          item-title="name"
          item-value="_id"
          label="Protocolo"
          variant="outlined"
          density="compact"
          required
        ></v-select>
        <v-text-field
          v-model="practice.institutionName"
          label="Nombre de la Institución"
          variant="outlined"
          density="compact"
          required
        ></v-text-field>
        <v-text-field
          v-model="practice.courseName"
          label="Nombre del Curso/Grado"
          variant="outlined"
          density="compact"
          required
        ></v-text-field>
        <v-select
          v-if="isEditMode"
          v-model="practice.status"
          :items="Object.values(PracticeStatus)"
          label="Estado de la Práctica"
          variant="outlined"
          density="compact"
        ></v-select>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="save">Guardar</v-btn>
      <v-btn color="grey" @click="cancel">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { PracticeStatus } from '~/types/practice';
import type { CreatePracticeInput, UpdatePracticeInput } from '~/types/practice.input';

const props = defineProps<{
  initialPractice?: UpdatePracticeInput;
  isEditMode: boolean;
  students: Array<{ _id: string; name: string }>;
  advisors: Array<{ _id: string; name: string }>;
  protocols: Array<{ _id: string; name: string }>;
}>();

const emit = defineEmits(['save', 'cancel']);

const practice = ref<CreatePracticeInput | UpdatePracticeInput>(props.initialPractice || {
  studentId: '',
  advisorId: '',
  protocolId: '',
  institutionName: '',
  courseName: '',
  status: PracticeStatus.ASSIGNED,
});

watch(() => props.initialPractice, (newVal) => {
  if (newVal) {
    practice.value = { ...newVal };
  }
}, { deep: true, immediate: true });

const form = ref<HTMLFormElement | null>(null);

const save = async () => {
  const { valid } = await form.value!.validate();
  if (valid) {
    emit('save', practice.value);
  }
};

const cancel = () => {
  emit('cancel');
};
</script>