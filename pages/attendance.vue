<template>
  <v-container>
    <v-form @submit.prevent="submitForm">
      <v-text-field
        v-model="courseId"
        label="ID del Curso"
        required
        @input="fetchProtocols(courseId)"
      ></v-text-field>
      <v-select
        v-model="formData.records[0].protocolId"
        :items="protocols"
        item-title="name"
        item-value="_id"
        label="Seleccionar Protocolo"
        required
      ></v-select>
      <v-text-field
        v-model="formData.teacherName"
        label="Nombre del Docente"
        required
      ></v-text-field>
      <v-text-field
        v-model="formData.advisorName"
        label="Nombre del Asesor"
        required
      ></v-text-field>
      <v-text-field
        v-model="formData.institution"
        label="Institución"
        required
      ></v-text-field>
      <v-text-field
        v-model="formData.tutorName"
        label="Nombre del Tutor"
        required
      ></v-text-field>
      <v-text-field
        v-model="formData.assignedGroups"
        label="Grupos Asignados"
        required
      ></v-text-field>
      <v-row v-for="(record, index) in formData.records" :key="index">
        <v-col cols="12" sm="2">
          <v-text-field
            v-model="record.week"
            label="Semana"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="2">
          <v-text-field
            v-model="record.date"
            label="Fecha"
            type="date"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="2">
          <v-text-field
            v-model="record.topic"
            label="Tema"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="2">
          <v-text-field
            v-model.number="record.hours"
            label="Horas"
            type="number"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="2">
          <v-text-field
            v-model="record.group"
            label="Grupo"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="2">
          <v-text-field
            v-model="record.classType"
            label="Tipo de Clase"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="2">
          <v-text-field v-model="record.other" label="Otro"></v-text-field>
        </v-col>
        <v-col cols="12" sm="2">
          <v-text-field
            v-model="record.observations"
            label="Observaciones"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="2">
          <v-text-field
            v-model="record.advisorSignature"
            label="Firma del Asesor"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="2">
          <v-text-field
            v-model="record.tutorSignature"
            label="Firma del Tutor"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-btn color="primary" type="submit" :disabled="loading">
        Generar PDF
      </v-btn>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, watch } from "vue";
import { useAttendanceForm } from "~/composables/useAttendanceForm";

const {
  formData,
  records,
  protocols,
  loading,
  error,
  submitForm,
  fetchProtocols,
  fetchRecords,
} = useAttendanceForm();
const courseId = ref("");

watch(
  () => formData.value.records[0].protocolId,
  (newProtocolId) => {
    if (newProtocolId) {
      fetchRecords(newProtocolId);
    }
  }
);
</script>
