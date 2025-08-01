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
              :courses="courseStore.courses"
              @view="viewCourse"
              @delete="confirmDelete"
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
            <v-textarea
              v-model="newCourse.description"
              label="Descripción"
              variant="outlined"
            />
            <v-text-field
              v-model="newCourse.startDate"
              label="Fecha de Inicio"
              type="date"
              variant="outlined"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <v-text-field
              v-model="newCourse.endDate"
              label="Fecha de Fin"
              type="date"
              variant="outlined"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <EntityAutocomplete
              v-model="newCourse.protocolIds"
              specific-type="protocol"
              label="Protocolos Asociados"
              :multiple="true"
            ></EntityAutocomplete>
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
    <!-- Modal de Confirmación de Borrado -->
    <v-dialog v-model="deleteDialog" persistent max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Borrado</v-card-title>
        <v-card-text
          >¿Estás seguro de que quieres eliminar este curso? Esta acción no se
          puede deshacer.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false"
            >Cancelar</v-btn
          >
          <v-btn color="red darken-1" text @click="deleteCourseConfirmed"
            >Aceptar</v-btn
          >
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
import { useCourseStore } from "~/stores/courseStore";
import CourseList from "~/components/CourseList.vue";
import EntityAutocomplete from "~/components/EntityAutocomplete.vue";

// definePageMeta({});

const router = useRouter();
const courseStore = useCourseStore();
const createCourseDialog = ref(false);
const createCourseForm = ref();
const newCourse = ref({
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  protocolIds: [] as string[],
});
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

const deleteDialog = ref(false); // NEW
const courseToDelete = ref<any>(null); // NEW

onMounted(() => {
  courseStore.fetchCourses();
});

const openCreateCourseDialog = () => {
  createCourseDialog.value = true;
  newCourse.value = {
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    protocolIds: [],
  };
};

const createCourse = async () => {
  const { valid } = await createCourseForm.value.validate();
  if (!valid) return;

  try {
    console.log(
      "courses/index.vue: newCourse.protocolIds before sending:",
      newCourse.value.protocolIds
    ); // NEW LOG
    await courseStore.createCourse({
      name: newCourse.value.name,
      description: newCourse.value.description,
      startDate: newCourse.value.startDate,
      endDate: newCourse.value.endDate,
      protocolIds: newCourse.value.protocolIds,
    });
    snackbar.value = {
      show: true,
      text: "¡Curso creado exitosamente!",
      color: "success",
      timeout: 3000,
    };
    createCourseDialog.value = false;
    newCourse.value = {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      protocolIds: [],
    };
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

const confirmDelete = (course: any) => {
  // NEW
  courseToDelete.value = course;
  deleteDialog.value = true;
};

const deleteCourseConfirmed = async () => {
  // NEW
  if (courseToDelete.value) {
    try {
      await courseStore.deleteCourse(courseToDelete.value.id);
      snackbar.value = {
        show: true,
        text: "¡Curso eliminado exitosamente!",
        color: "success",
        timeout: 3000,
      };
    } catch (error: any) {
      snackbar.value = {
        show: true,
        text: `Error al eliminar: ${error.message}`,
        color: "error",
        timeout: 3000,
      };
    }
  }
  deleteDialog.value = false;
  courseToDelete.value = null;
};
</script>

<style scoped>
.v-card {
  background-color: #fff;
}
</style>
