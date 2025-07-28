<template>
  <v-container>
    <v-card>
      <v-card-title>Carga Masiva de Formularios</v-card-title>
      <v-card-text>
        <v-file-input
          v-if="!files.length"
          v-model="files"
          label="Seleccionar archivos JSON"
          multiple
          accept=".json"
          @change="handleFiles"
        ></v-file-input>

        <div v-if="files.length">
          <v-list>
            <v-list-item v-for="(file, index) in files" :key="index">
              <v-list-item-title>{{ file.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip :color="status[file.name]?.color || 'grey'" dark>
                  {{ status[file.name]?.text || "Listo para cargar" }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-progress-linear
            v-if="uploading"
            v-model="progress"
            :buffer-value="progress"
            striped
            height="20"
          >
            <strong>{{ Math.ceil(progress) }}%</strong>
          </v-progress-linear>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="uploadForms"
          :disabled="!files.length || uploading"
        >
          Subir Formularios
        </v-btn>
        <v-btn color="grey" @click="reset" :disabled="uploading">
          Limpiar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useFormStore } from "~/stores/formStore";

const files = ref<File[]>([]);
const status = ref<Record<string, { text: string; color: string }>>({});
const uploading = ref(false);
const progress = ref(0);
const formStore = useFormStore();

const handleFiles = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    files.value = Array.from(target.files);
    files.value.forEach((file) => {
      status.value[file.name] = { text: "Listo para cargar", color: "grey" };
    });
  }
};

const uploadForms = async () => {
  uploading.value = true;
  progress.value = 0;

  const batchSize = 5;
  const totalFiles = files.value.length;
  let processedFiles = 0;

  for (let i = 0; i < totalFiles; i += batchSize) {
    const batch = files.value.slice(i, i + batchSize);
    const formInputs = await Promise.all(
      batch.map(async (file) => {
        status.value[file.name] = { text: "Cargando...", color: "blue" };
        const content = await file.text();
        return JSON.parse(content);
      })
    );

    try {
      await formStore.createManyForms(formInputs);
      batch.forEach((file) => {
        status.value[file.name] = { text: "Éxito", color: "green" };
      });
    } catch (error) {
      batch.forEach((file) => {
        status.value[file.name] = { text: "Error", color: "red" };
      });
      console.error("Error al subir el lote de formularios:", error);
    }

    processedFiles += batch.length;
    progress.value = (processedFiles / totalFiles) * 100;
  }

  uploading.value = false;
};

const reset = () => {
  files.value = [];
  status.value = {};
  progress.value = 0;
  uploading.value = false;
};
</script>
