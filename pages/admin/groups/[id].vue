<template>
  <v-container v-if="groupStore.currentGroup">
    <v-col cols="12">
      <GroupDetailHeader :group="groupStore.currentGroup" />
    </v-col>
    <v-col cols="12">
      <GroupProgress :group="groupStore.currentGroup" />
    </v-col>
    <v-col cols="12">
      <GroupFormList
        :group="groupStore.currentGroup"
      />
    </v-col>
  </v-container>
  <v-container v-else>
    <v-row>
      <v-col cols="12">
        <p>Cargando detalles del grupo...</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useGroupStore } from "~/stores/groupStore";
import { useAuthStore } from "~/stores/authStore";
import GroupDetailHeader from "~/components/practices/GroupDetailHeader.vue";
import GroupProgress from "~/components/practices/GroupProgress.vue";
import GroupFormList from "~/components/practices/GroupFormList.vue";

const route = useRoute();
const groupStore = useGroupStore();
const authStore = useAuthStore();

onMounted(async () => {
  const groupId = route.params.id as string;
  if (groupId) {
    try {
      await groupStore.fetchGroup(groupId);
    } catch (error) {
      console.error(
        "groups/[id].vue: Error fetching group details:",
        error
      );
    }
  }
});
</script>
