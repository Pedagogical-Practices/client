import type { PracticeStatus } from "./practice";

export interface CreatePracticeInput {
  studentId: string;
  advisorId: string;
  protocolId: string;
  institutionName: string;
  courseName: string;
}

export interface UpdatePracticeInput {
  id: string;
  studentId?: string;
  advisorId?: string;
  protocolId?: string;
  institutionName?: string;
  courseName?: string;
  status?: PracticeStatus;
}