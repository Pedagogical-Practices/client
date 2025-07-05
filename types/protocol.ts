import type { Form } from "./form";

export interface Protocol {
  _id: string;
  name: string;
  module: string;
  forms: Form[];
  createdBy: string; // O User si lo populaste
  createdAt: string;
}