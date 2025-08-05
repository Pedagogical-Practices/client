<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 primary--text">Gestionar Fechas Límite de Protocolos</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Seleccionar Grupo</v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedGroupId"
              :items="groupStore.groups"
              item-title="name"
              item-value="id"
              label="Selecciona un Grupo"
              variant="outlined"
              clearable
            ></v-select>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="selectedGroup">
      <v-col cols="12">
        <v-card>
          <v-card-title>Fechas Límite para {{ selectedGroup.name }}</v-card-title>
          <v-card-text>
            <v-list lines="two">
              <v-list-item
                v-for="protocol in selectedGroup.protocols"
                :key="protocol.id"
                :title="protocol.name"
                :subtitle="getDeadlineText(protocol.id)"
              >
                <template v-slot:append>
                  <v-btn
                    icon="mdi-pencil"
                    variant="text"
                    color="primary"
                    @click="openDeadlineDialog(protocol)"
                  ></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>Establecer Fecha Límite para {{ currentProtocol?.name }}</v-card-title>
        <v-card-text>
          <v-form ref="deadlineForm">
            <v-text-field
              v-model="currentDeadline.startDate"
              label="Fecha de Inicio (YYYY-MM-DD)"
              type="date"
              variant="outlined"
            ></v-text-field>
            <v-text-field
              v-model="currentDeadline.endDate"
              label="Fecha de Fin (YYYY-MM-DD)"
              type="date"
              variant="outlined"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" @click="saveDeadline">Guardar</v-btn>
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
import { ref, onMounted, computed, watch } from 'vue';
import { useGroupStore } from '~/stores/groupStore';
import { useAuthStore } from '~/stores/authStore';
import { useProtocolStore } from '~/stores/protocolStore';
import { useGroupProtocolDeadlineStore } from '~/stores/groupProtocolDeadlineStore';
import { Protocol } from '~/types';

const groupStore = useGroupStore();
const authStore = useAuthStore();
const protocolStore = useProtocolStore();
const groupProtocolDeadlineStore = useGroupProtocolDeadlineStore();

const selectedGroupId = ref<string | null>(null);
const selectedGroup = computed(() => {
  return groupStore.groups.find(group => group.id === selectedGroupId.value);
});

const dialog = ref(false);
const currentProtocol = ref<Protocol | null>(null);
const currentDeadline = ref({
  startDate: '',
  endDate: '',
});

const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  timeout: 3000,
});

onMounted(async () => {
  if (authStore.user?.id) {
    await groupStore.findGroupsByTutor(authStore.user.id);
  }
});

watch(selectedGroupId, async (newVal) => {
  if (newVal) {
    await groupProtocolDeadlineStore.fetchDeadlinesByGroup(newVal);
  }
});

const getDeadlineText = (protocolId: string) => {
  const deadline = groupProtocolDeadlineStore.deadlines.find(
    (d) => d.protocol.id === protocolId && d.group.id === selectedGroupId.value
  );
  if (deadline) {
    const start = deadline.startDate ? new Date(deadline.startDate).toLocaleDateString() : 'N/A';
    const end = new Date(deadline.endDate).toLocaleDateString();
    return `Inicio: ${start} - Fin: ${end}`;
  }
  return 'No establecida';
};

const openDeadlineDialog = (protocol: Protocol) => {
  currentProtocol.value = protocol;
  const existingDeadline = groupProtocolDeadlineStore.deadlines.find(
    (d) => d.protocol.id === protocol.id && d.group.id === selectedGroupId.value
  );
  if (existingDeadline) {
    currentDeadline.value = {
      startDate: existingDeadline.startDate ? new Date(existingDeadline.startDate).toISOString().split('T')[0] : '',
      endDate: new Date(existingDeadline.endDate).toISOString().split('T')[0],
    };
  } else {
    currentDeadline.value = {
      startDate: '',
      endDate: '',
    };
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  currentProtocol.value = null;
  currentDeadline.value = {
    startDate: '',
    endDate: '',
  };
};

const saveDeadline = async () => {
  if (!selectedGroupId.value || !currentProtocol.value) return;

  try {
    const existingDeadline = groupProtocolDeadlineStore.deadlines.find(
      (d) => d.protocol.id === currentProtocol.value?.id && d.group.id === selectedGroupId.value
    );

    if (existingDeadline) {
      await groupProtocolDeadlineStore.updateDeadline(
        existingDeadline.id,
        {
          startDate: currentDeadline.value.startDate,
          endDate: currentDeadline.value.endDate,
        }
      );
      snackbar.value = {
        show: true,
        text: '¡Fecha límite actualizada exitosamente!',
        color: 'success',
        timeout: 3000,
      };
    } else {
      await groupProtocolDeadlineStore.createDeadline({
        groupId: selectedGroupId.value,
        protocolId: currentProtocol.value.id,
        startDate: currentDeadline.value.startDate,
        endDate: currentDeadline.value.endDate,
      });
      snackbar.value = {
        show: true,
        text: '¡Fecha límite creada exitosamente!',
        color: 'success',
        timeout: 3000,
      };
    }
    closeDialog();
  } catch (error: any) {
    console.error('Error al guardar fecha límite:', error);
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: 'error',
      timeout: 3000,
    };
  }
};
</script>
