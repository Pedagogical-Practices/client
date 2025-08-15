<template>
  <v-card elevation="2" class="available-elements-card" variant="outlined">
    <v-card-title class="text-subtitle-1 font-weight-medium pa-3">
      Available Elements
    </v-card-title>
    <v-divider></v-divider>
    <v-list nav density="compact">
      <v-list-item
        v-for="elementDef in availableElements"
        :key="elementDef.type"
        :draggable="true"
        @dragstart="handleDragStart(elementDef, $event)"
        @click="addElementByClick(elementDef)"
        link
        class="draggable-element-item"
      >
        <template v-slot:prepend>
          <v-icon :icon="elementDef.icon" class="mr-3"></v-icon>
        </template>
        <v-list-item-title class="text-body-2">{{
          elementDef.displayName
        }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useFormElementStore } from "~/stores/formElementStore";
import type { FormField } from "~/types";
import { type AvailableElementDefinition } from "~/types";
import { availableElements } from "./formElementDefinitions";

const formElement = useFormElementStore();

const addElementByClick = (elementDef: AvailableElementDefinition) => {
  const newElement: FormField = {
    ...JSON.parse(JSON.stringify(elementDef.defaultConfig)),
    name: `field_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // Generate a unique name
  };
  formElement.addElement(newElement);
};

const handleDragStart = (
  elementDef: AvailableElementDefinition,
  event: DragEvent
) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: elementDef.type,
        name:
          elementDef.defaultConfig.name ||
          `field_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      }) // Pass name for identification
    );
    event.dataTransfer.effectAllowed = "copy";
  }
};
</script>

<style scoped>
.available-elements-card {
  border-radius: 8px;
}
.v-list-item {
  padding-top: 10px;
  padding-bottom: 10px;
  cursor: grab;
  transition: background-color 0.2s ease-in-out;
}
.v-list-item:not(:last-child) {
  border-bottom: 1px solid #eeeeee;
}
.v-list-item:hover {
  background-color: #e9f5ff;
}
.draggable-element-item:active {
  cursor: grabbing;
  background-color: #dcf0ff;
}
.v-list-item-title {
  line-height: 1.4;
}
</style>
