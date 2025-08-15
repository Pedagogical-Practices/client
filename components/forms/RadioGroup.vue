<template>
  <div>
    <v-card-text>{{ label }} </v-card-text>
    <v-radio-group v-model="selectedValue">
      <div v-for="option in options" :key="option.value" class="radio-item">
        <v-radio
          :label="option.label"
          :value="option.value"
          hide-details
          density="compact"
        ></v-radio>
        <v-text-field
          v-if="option.isOtherOption && selectedValue === option.value"
          v-model="otherValue"
          label="Por favor, especifique"
          variant="outlined"
          density="compact"
          class="ml-8 other-textfield"
          @update:model-value="updateOtherText"
        ></v-text-field>
      </div>
    </v-radio-group>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";

interface RadioOption {
  label: string;
  value: string;
  isOtherOption?: boolean;
}

const props = defineProps<{
  label: string;
  options: RadioOption[];
  modelValue: Record<string, any>;
}>();

const emit = defineEmits(["update:modelValue"]);

const otherValue = ref("");

// This computed property handles the two-way binding with the v-radio-group.
const selectedValue = computed({
  get() {
    if (
      !props.modelValue ||
      typeof props.modelValue !== "object" ||
      Object.keys(props.modelValue).length === 0
    ) {
      return null;
    }
    const key = Object.keys(props.modelValue)[0];
    const option = props.options.find((opt) => opt.value === key);

    if (option?.isOtherOption && typeof props.modelValue[key] === "string") {
      otherValue.value = props.modelValue[key];
    } else if (option?.isOtherOption) {
      otherValue.value = "";
    }
    return key;
  },
  set(newValue) {
    if (!newValue) {
      emit("update:modelValue", {});
      return;
    }

    const option = props.options.find((opt) => opt.value === newValue);
    if (option?.isOtherOption) {
      otherValue.value = ""; // Reset other text when a new 'other' is selected
      emit("update:modelValue", { [newValue]: true });
    } else {
      emit("update:modelValue", { [newValue]: true });
    }
  },
});

// When the user types in the 'other' text field, update the model.
const updateOtherText = (newText: string) => {
  const otherOption = props.options.find(
    (opt) => opt.isOtherOption && opt.value === selectedValue.value
  );
  if (otherOption) {
    emit("update:modelValue", { [otherOption.value]: newText || true });
  }
};
</script>

<style scoped>
.radio-item {
  margin-bottom: 4px;
}
.other-textfield {
  margin-top: -8px;
  margin-bottom: 8px;
}
</style>
