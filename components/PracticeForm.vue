<template>
  <v-card>
    <v-card-title>{{ isEditMode ? 'Editar Práctica' : 'Asignar Nueva Práctica' }}</v-card-title>
    <v-card-text>
      <v-form ref="form">
        <EntityAutocomplete
          v-model="practice.courseId"
          specific-type="course"
          label="Curso"
          required
        ></EntityAutocomplete>
        <EntityAutocomplete
          v-model="practice.studentId"
          specific-type="student"
          label="Estudiante"
          required
        ></EntityAutocomplete>
        <EntityAutocomplete
          v-model="practice.teacherId"
          specific-type="teacher"
          label="Docente Asesor"
          required
        ></EntityAutocomplete>
        <EntityAutocomplete
          v-model="practice.protocolIds"
          specific-type="protocol"
          label="Protocolos"
          multiple
        ></EntityAutocomplete>
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
import { PracticeStatus } from '~/server/src/common/enums/practice-status.enum';
import EntityAutocomplete from './EntityAutocomplete.vue';

const props = defineProps<{
  initialPractice?: any; // Use any for now, will define specific types later
  isEditMode: boolean;
}>();

const emit = defineEmits(['save', 'cancel']);

const practice = ref<any>(props.initialPractice || {
  courseId: '',
  studentId: '',
  teacherId: '',
  protocolIds: [],
  status: PracticeStatus.PENDING,
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