export enum UserRole {
  ADMIN = "ADMIN",
  COORDINATOR = "COORDINATOR",
  TUTOR = "TUTOR",
  ASSESSOR = "ASSESSOR",
  STUDENT = "STUDENT",
  FAMILY = "FAMILY",
  VISITOR = "VISITOR",
}

export enum FormFieldType {
  TEXT = "TEXT",
  TEXTAREA = "TEXTAREA",
  SELECT = "SELECT",
  DATE = "DATE",
  MAP = "MAP",
  FILE_UPLOAD = "FILE_UPLOAD",
  CHECKBOX = "CHECKBOX",
  CHECKBOX_GROUP = "CHECKBOX_GROUP",
  RADIO_GROUP = "RADIO_GROUP",
  TYPOGRAPHY_HEADING = "TYPOGRAPHY_HEADING",
  TYPOGRAPHY_BODY = "TYPOGRAPHY_BODY",
  DATE_PICKER = "DATE_PICKER",
  DATE_INPUT = "DATE_INPUT",
  TIME_PICKER = "TIME_PICKER",
  BUTTON = "BUTTON",
  AUTOCOMPLETE = "AUTOCOMPLETE",
  NUMBER = "NUMBER",
  EMAIL = "EMAIL",
  PASSWORD = "PASSWORD",
}

export enum DataSourceType {
  INSTITUTIONS = "institutions",
  TEACHERS = "teachers",
  STUDENTS = "students",
  COURSES = "courses",
  FORMS = "forms",
  PROTOCOLS = "protocols",
  USERS = "users",
}

export enum SubmissionStatus {
  SUBMITTED = "SUBMITTED",
  REVIEWED = "REVIEWED",
  APPROVED = "APPROVED",
  NEEDS_REVISION = "NEEDS_REVISION",
}

export enum PracticeStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole[];
  createdAt?: string;
  updatedAt?: string;
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
  color?: string;
  // Typography properties
  text?: string;
  variant?: string;
  fontWeight?: string;
  textAlign?: string;
  textDecoration?: string;
  textTransform?: string;
  tag?: string;
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
  forms: Form[];
  productType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Practice {
  id: string;
  name: string;
  description?: string;
  protocols?: Protocol[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Submission {
  id: string;
  group: Group;
  protocol: Protocol;
  students: User[];
  formData: Record<string, any>;
  locationData?: Record<string, any>;
  score?: number;
  feedback?: string;
  status?: SubmissionStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Institution {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GroupProtocolDeadline {
  id: string;
  group: Group;
  protocol: Protocol;
  startDate?: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Group {
  id: string;
  name: string;
  period: string;
  practice: Practice;
  tutor: User;
  students: User[];
  institutions: Institution[];
  deadlines: GroupProtocolDeadline[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AvailableElementDefinition {
  name: string;
  type: FormFieldType;
  displayName: string;
  icon: string;
  defaultConfig: FormField;
}
