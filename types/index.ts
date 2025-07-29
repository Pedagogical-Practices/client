export enum UserRole {
  ADMIN = "ADMIN",
  TEACHER_DIRECTIVE = "TEACHER_DIRECTIVE",
  STUDENT = "STUDENT",
  FAMILY = "FAMILY",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export enum FormFieldType {
  TEXT = "TEXT",
  TEXTAREA = "TEXTAREA",
  SELECT = "SELECT",
  DATE = "DATE",
  MAP = "MAP",
  FILE_UPLOAD = "FILE_UPLOAD",
  CHECKBOX = "CHECKBOX",
  DATE_PICKER = "DATE_PICKER",
  // DATE_INPUT = "DATE_INPUT",
  RADIO_GROUP = "RADIO_GROUP",
  TIME_PICKER = "TIME_PICKER",
  BUTTON = "BUTTON",
  AUTOCOMPLETE = "AUTOCOMPLETE",
  NUMBER = "NUMBER",
  EMAIL = "EMAIL",
  PASSWORD = "PASSWORD",
}

export interface FormField {
  id?: string;
  name: string;
  label: string;
  type: FormFieldType;
  options?: any[] | Record<string, any> | undefined;
  rules?: string[];
  defaultValue?: string;
  value?: string;
  variableName?: string;
  hint?: string;
  required?: boolean;
  chapter?: string;
  question?: string;
  questionNumber?: string;
  consistencyCondition?: string;
  inconsistencyMessage?: string;
  errorType?: string;
  description?: string;
  disabled?: boolean;
  readonly?: boolean;
  dataSource?: string;
  placeholder?: string;
  specificType?: string;
  height?: string;
  multiple?: boolean;
}

export interface Form {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Protocol {
  id: string;
  name: string;
  description?: string;
  form: Form;
  productType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum PracticeStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
  ASSIGNED = "ASSIGNED",
  REVIEWED = "REVIEWED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
  ON_HOLD = "ON_HOLD",
  NOT_STARTED = "NOT_STARTED",
  IN_REVIEW = "IN_REVIEW",
  READY_FOR_REVIEW = "READY_FOR_REVIEW",
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  protocols?: Protocol[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Submission {
  id: string;
  practice: Practice;
  protocol: Protocol;
  formData: Record<string, any>;
  locationData?: Record<string, any>;
  score?: number;
  feedback?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Practice {
  id: string;
  course: Course;
  student: User;
  teacher: User;
  status: PracticeStatus;
  protocols: Protocol[];
  submissions: Submission[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Institution {
  _id?: string;
  name: string;
  address?: string;
  phone?: string;
}

export interface Submission {
  id: string;
  formId: string;
  practiceId: string;
  userId: string;
  data: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}
