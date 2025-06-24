<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Cursos</span>
            <v-btn
              color="primary"
              @click="openCreateCourseDialog"
              prepend-icon="mdi-plus"
            >
              Crear Curso
            </v-btn>
          </v-card-title>
          <v-card-text>
            <CourseList
              :courses="formBuilderStore.courses"
              @view="viewCourse"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="createCourseDialog" max-width="600px">
      <v-card>
        <v-card-title>Crear Nuevo Curso</v-card-title>
        <v-card-text>
          <v-form ref="createCourseForm">
            <v-text-field
              v-model="newCourse.name"
              label="Nombre del Curso"
              variant="outlined"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <v-text-field
              v-model="newCourse.institution"
              label="Institución Educativa"
              variant="outlined"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <v-combobox
              v-model="newCourse.assignedGroups"
              label="Grupos Asignados"
              variant="outlined"
              multiple
              chips
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" @click="createCourseDialog = false"
            >Cancelar</v-btn
          >
          <v-btn color="primary" @click="createCourse">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="top right"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useFormBuilderStore } from "~/stores/formBuilderStore";
import CourseList from "~/components/CourseList.vue";

// Middleware para admin
definePageMeta({
  middleware: ["auth"],
});

const router = useRouter();
const formBuilderStore = useFormBuilderStore();
const createCourseDialog = ref(false);
const createCourseForm = ref();
const newCourse = ref({
  name: "",
  institution: "",
  assignedGroups: [] as string[],
});
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

onMounted(() => {
  formBuilderStore.fetchCourses();
});

const openCreateCourseDialog = () => {
  createCourseDialog.value = true;
  newCourse.value = { name: "", institution: "", assignedGroups: [] };
};

const createCourse = async () => {
  const { valid } = await createCourseForm.value.validate();
  if (!valid) return;

  try {
    await formBuilderStore.createCourse(newCourse.value);
    snackbar.value = {
      show: true,
      text: "¡Curso creado exitosamente!",
      color: "success",
      timeout: 3000,
    };
    createCourseDialog.value = false;
    newCourse.value = { name: "", institution: "", assignedGroups: [] };
  } catch (error: any) {
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: "error",
      timeout: 3000,
    };
  }
};

const viewCourse = (courseId: string) => {
  router.push(`/courses/${courseId}`);
};
</script>

<style scoped>
.v-card {
  background-color: #fff;
}
</style>
