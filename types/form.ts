import type { FormField } from "./formField"; // Asumiendo que tienes un tipo FormField

export interface Form {
  _id: string;
  name: string;
  fields: FormField[];
  createdBy: string; // O User si lo populaste
  createdAt: string;
}