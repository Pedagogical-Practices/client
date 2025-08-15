<template>
  <div>
    <v-card-text>{{ label }} </v-card-text>
    <div class="checkbox-group-container mt-2">
      <div v-for="option in options" :key="option.value" class="checkbox-item">
        <v-checkbox
          v-model="selectedValues"
          :label="option.label"
          :value="option.value"
          hide-details
          density="compact"
        ></v-checkbox>
        <v-text-field
          v-if="option.isOtherOption && selectedValues.includes(option.value)"
          v-model="otherValue"
          label="Por favor, especifique"
          variant="outlined"
          density="compact"
          class="ml-8 other-textfield"
        ></v-text-field>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";

interface CheckboxOption {
  label: string;
  value: string;
  isOtherOption?: boolean;
}

const props = defineProps<{
  label: string;
  options: CheckboxOption[];
  modelValue: Record<string, any>;
}>();

const emit = defineEmits(["update:modelValue"]);

const otherValue = ref("");

// Initialize otherValue when the component loads or the model changes
watch(
  () => props.modelValue,
  (newValue) => {
    const otherOption = props.options.find((opt) => opt.isOtherOption);
    if (
      otherOption &&
      newValue &&
      typeof newValue[otherOption.value] === "string"
    ) {
      otherValue.value = newValue[otherOption.value];
    } else {
      otherValue.value = "";
    }
  },
  { immediate: true, deep: true }
);

const selectedValues = computed({
  get() {
    if (!props.modelValue || typeof props.modelValue !== "object") {
      return [];
    }
    return Object.keys(props.modelValue).filter((key) => props.modelValue[key]);
  },
  set(newValues) {
    const newModelValue: Record<string, any> = {};
    newValues.forEach((value) => {
      const option = props.options.find((opt) => opt.value === value);
      if (option?.isOtherOption) {
        // When the 'other' checkbox is checked, we use the value from the otherValue ref.
        newModelValue[value] = otherValue.value || true;
      } else {
        newModelValue[value] = true;
      }
    });
    emit("update:modelValue", newModelValue);
  },
});

// Watch for changes in the 'other' text field and update the model if the 'other' checkbox is checked
watch(otherValue, (newText) => {
  const otherOption = props.options.find((opt) => opt.isOtherOption);
  if (otherOption && selectedValues.value.includes(otherOption.value)) {
    const newModelValue = { ...props.modelValue };
    newModelValue[otherOption.value] = newText || true;
    emit("update:modelValue", newModelValue);
  }
});
</script>

<style scoped>
.checkbox-group-container {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
}
.checkbox-item {
  margin-bottom: 4px;
}
.other-textfield {
  margin-top: -8px;
  margin-bottom: 8px;
}
</style>
