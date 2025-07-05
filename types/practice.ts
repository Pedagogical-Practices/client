import type { Protocol } from "./protocol"; // Asumiendo que Protocol ya está definido
import type { User } from "./user"; // Asumiendo que User ya está definido
import type { Form } from "./form"; // Asumiendo que Form ya está definido
import type { Submission } from "./submission"; // Asumiendo que Submission ya está definido

export enum PracticeStatus {
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REVIEWED = 'reviewed',
}

export interface FilledForm {
  form: Form; // El objeto Form populado
  submission?: Submission; // El objeto Submission populado (opcional)
}

export interface Practice {
  _id: string;
  student: User;
  advisor: User;
  protocol: Protocol;
  institutionName: string;
  courseName: string;
  status: PracticeStatus;
  filledForms: FilledForm[];
  createdBy: User;
  createdAt: string;
}