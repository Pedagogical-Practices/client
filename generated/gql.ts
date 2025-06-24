import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: UserDto;
};

export type Course = {
  __typename?: 'Course';
  _id: Scalars['ID']['output'];
  assignedGroups: Array<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  createdBy: Scalars['String']['output'];
  institution: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CreateCourseInput = {
  assignedGroups: Array<Scalars['String']['input']>;
  institution: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateFormInput = {
  fields: Array<FormFieldInput>;
  name: Scalars['String']['input'];
};

export type CreateProtocolInput = {
  courseId: Scalars['ID']['input'];
  formId: Scalars['ID']['input'];
  module: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateSubmissionInput = {
  data: Scalars['JSON']['input'];
  formId: Scalars['ID']['input'];
  protocolId: Scalars['ID']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role: Scalars['String']['input'];
};

export type FormDto = {
  __typename?: 'FormDto';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy: UserDto;
  fields: Array<FormFieldDto>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type FormFieldDto = {
  __typename?: 'FormFieldDto';
  chapter?: Maybe<Scalars['String']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  consistencyCondition?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  disabled?: Maybe<Scalars['Boolean']['output']>;
  errorType?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['String']['output']>;
  hint?: Maybe<Scalars['String']['output']>;
  inconsistencyMessage?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  options?: Maybe<Array<OptionDto>>;
  placeholder?: Maybe<Scalars['String']['output']>;
  question?: Maybe<Scalars['String']['output']>;
  questionNumber?: Maybe<Scalars['String']['output']>;
  readonly?: Maybe<Scalars['Boolean']['output']>;
  required: Scalars['Boolean']['output'];
  requirementLevel?: Maybe<Scalars['String']['output']>;
  rules?: Maybe<Array<Scalars['String']['output']>>;
  specificType?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  value?: Maybe<Scalars['String']['output']>;
  variableName?: Maybe<Scalars['String']['output']>;
};

export type FormFieldInput = {
  chapter?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  consistencyCondition?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  errorType?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['String']['input']>;
  hint?: InputMaybe<Scalars['String']['input']>;
  inconsistencyMessage?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<OptionInput>>;
  placeholder?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
  questionNumber?: InputMaybe<Scalars['String']['input']>;
  readonly?: InputMaybe<Scalars['Boolean']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  requirementLevel?: InputMaybe<Scalars['String']['input']>;
  rules?: InputMaybe<Array<Scalars['String']['input']>>;
  specificType?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
  value?: InputMaybe<Scalars['String']['input']>;
  variableName?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createCourse: Course;
  createForm: FormDto;
  createProtocol: Protocol;
  createUser: AuthPayload;
  deleteCourse: Scalars['Boolean']['output'];
  deleteProtocol: Scalars['Boolean']['output'];
  deleteSubmission: Scalars['Boolean']['output'];
  login: AuthPayload;
  removeForm: FormDto;
  submitProtocol: Submission;
  updateCourse: Course;
  updateForm: FormDto;
  updateProtocol: Protocol;
  updateSubmission: Submission;
  updateUser: UserDto;
};


export type MutationCreateCourseArgs = {
  createCourseInput: CreateCourseInput;
};


export type MutationCreateFormArgs = {
  createFormInput: CreateFormInput;
};


export type MutationCreateProtocolArgs = {
  createProtocolInput: CreateProtocolInput;
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationDeleteCourseArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteProtocolArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteSubmissionArgs = {
  id: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRemoveFormArgs = {
  id: Scalars['String']['input'];
};


export type MutationSubmitProtocolArgs = {
  createSubmissionInput: CreateSubmissionInput;
};


export type MutationUpdateCourseArgs = {
  updateCourseInput: UpdateCourseInput;
};


export type MutationUpdateFormArgs = {
  updateFormInput: UpdateFormInput;
};


export type MutationUpdateProtocolArgs = {
  updateProtocolInput: UpdateProtocolInput;
};


export type MutationUpdateSubmissionArgs = {
  updateSubmissionInput: UpdateSubmissionInput;
};


export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export type OptionDto = {
  __typename?: 'OptionDto';
  label: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type OptionInput = {
  label: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type Protocol = {
  __typename?: 'Protocol';
  _id: Scalars['ID']['output'];
  courseId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  createdBy: Scalars['String']['output'];
  formId: Scalars['ID']['output'];
  module: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  course: Course;
  courses: Array<Course>;
  form: FormDto;
  forms: Array<FormDto>;
  me?: Maybe<UserDto>;
  protocol: Protocol;
  protocols: Array<Protocol>;
  submission: Submission;
  submissions: Array<Submission>;
};


export type QueryCourseArgs = {
  id: Scalars['String']['input'];
};


export type QueryFormArgs = {
  id: Scalars['String']['input'];
};


export type QueryProtocolArgs = {
  id: Scalars['String']['input'];
};


export type QueryProtocolsArgs = {
  courseId: Scalars['String']['input'];
};


export type QuerySubmissionArgs = {
  id: Scalars['String']['input'];
};


export type QuerySubmissionsArgs = {
  protocolId: Scalars['String']['input'];
};

export type Submission = {
  __typename?: 'Submission';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  data: Scalars['JSON']['output'];
  formId: Scalars['ID']['output'];
  protocolId: Scalars['ID']['output'];
  submittedBy: Scalars['String']['output'];
};

export type UpdateCourseInput = {
  id: Scalars['ID']['input'];
};

export type UpdateFormInput = {
  fields?: InputMaybe<Array<FormFieldInput>>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProtocolInput = {
  id: Scalars['ID']['input'];
};

export type UpdateSubmissionInput = {
  id: Scalars['ID']['input'];
};

export type UpdateUserInput = {
  _id: Scalars['ID']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type UserDto = {
  __typename?: 'UserDto';
  _id: Scalars['ID']['output'];
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  role: Scalars['String']['output'];
};

export type CourseQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type CourseQuery = { __typename?: 'Query', course: { __typename?: 'Course', _id: string, name: string, institution: string, assignedGroups: Array<string>, createdBy: string, createdAt: string } };

export type CoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type CoursesQuery = { __typename?: 'Query', courses: Array<{ __typename?: 'Course', _id: string, name: string, institution: string, assignedGroups: Array<string>, createdBy: string, createdAt: string }> };

export type CreateCourseMutationVariables = Exact<{
  createCourseInput: CreateCourseInput;
}>;


export type CreateCourseMutation = { __typename?: 'Mutation', createCourse: { __typename?: 'Course', _id: string, name: string, institution: string, assignedGroups: Array<string>, createdBy: string, createdAt: string } };

export type CreateFormMutationVariables = Exact<{
  createFormInput: CreateFormInput;
}>;


export type CreateFormMutation = { __typename?: 'Mutation', createForm: { __typename?: 'FormDto', _id: string, name: string, createdAt: any, fields: Array<{ __typename?: 'FormFieldDto', type: string, label?: string | null, value?: string | null, variableName?: string | null, placeholder?: string | null, hint?: string | null, height?: string | null, required: boolean, chapter?: string | null, question?: string | null, questionNumber?: string | null, consistencyCondition?: string | null, inconsistencyMessage?: string | null, errorType?: string | null, description?: string | null, requirementLevel?: string | null, disabled?: boolean | null, readonly?: boolean | null, name?: string | null, specificType?: string | null, color?: string | null, rules?: Array<string> | null, options?: Array<{ __typename?: 'OptionDto', label: string, value: string }> | null }>, createdBy: { __typename?: 'UserDto', name: string, email: string } } };

export type CreateProtocolMutationVariables = Exact<{
  createProtocolInput: CreateProtocolInput;
}>;


export type CreateProtocolMutation = { __typename?: 'Mutation', createProtocol: { __typename?: 'Protocol', _id: string, courseId: string, name: string, module: string, formId: string, createdAt: string } };

export type FormQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type FormQuery = { __typename?: 'Query', form: { __typename?: 'FormDto', _id: string, name: string, createdAt: any, fields: Array<{ __typename?: 'FormFieldDto', type: string, label?: string | null, value?: string | null, variableName?: string | null, placeholder?: string | null, hint?: string | null, height?: string | null, required: boolean, chapter?: string | null, question?: string | null, questionNumber?: string | null, consistencyCondition?: string | null, inconsistencyMessage?: string | null, errorType?: string | null, description?: string | null, requirementLevel?: string | null }>, createdBy: { __typename?: 'UserDto', name: string, email: string } } };

export type FormsQueryVariables = Exact<{ [key: string]: never; }>;


export type FormsQuery = { __typename?: 'Query', forms: Array<{ __typename?: 'FormDto', _id: string, name: string, createdAt: any, createdBy: { __typename?: 'UserDto', name: string, email: string } }> };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'UserDto', _id: string, name: string, email: string, role: string } } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'UserDto', _id: string, name: string, email: string, role: string } | null };

export type ProtocolQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ProtocolQuery = { __typename?: 'Query', protocol: { __typename?: 'Protocol', _id: string, courseId: string, name: string, module: string, formId: string, createdAt: string } };

export type ProtocolsQueryVariables = Exact<{
  courseId: Scalars['String']['input'];
}>;


export type ProtocolsQuery = { __typename?: 'Query', protocols: Array<{ __typename?: 'Protocol', _id: string, courseId: string, name: string, module: string, formId: string, createdAt: string }> };

export type CreateUserMutationVariables = Exact<{
  createUserInput: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'UserDto', name: string, email: string, role: string } } };

export type SubmissionsQueryVariables = Exact<{
  protocolId: Scalars['String']['input'];
}>;


export type SubmissionsQuery = { __typename?: 'Query', submissions: Array<{ __typename?: 'Submission', _id: string, protocolId: string, formId: string, data: any, submittedBy: string, createdAt: string }> };

export type SubmitProtocolMutationVariables = Exact<{
  createSubmissionInput: CreateSubmissionInput;
}>;


export type SubmitProtocolMutation = { __typename?: 'Mutation', submitProtocol: { __typename?: 'Submission', _id: string, protocolId: string, formId: string, data: any, submittedBy: string, createdAt: string } };

export type UpdateUserMutationVariables = Exact<{
  updateUserInput: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UserDto', _id: string, name: string, email: string, role: string } };


export const CourseDocument = gql`
    query Course($id: String!) {
  course(id: $id) {
    _id
    name
    institution
    assignedGroups
    createdBy
    createdAt
  }
}
    `;
export const CoursesDocument = gql`
    query Courses {
  courses {
    _id
    name
    institution
    assignedGroups
    createdBy
    createdAt
  }
}
    `;
export const CreateCourseDocument = gql`
    mutation CreateCourse($createCourseInput: CreateCourseInput!) {
  createCourse(createCourseInput: $createCourseInput) {
    _id
    name
    institution
    assignedGroups
    createdBy
    createdAt
  }
}
    `;
export const CreateFormDocument = gql`
    mutation CreateForm($createFormInput: CreateFormInput!) {
  createForm(createFormInput: $createFormInput) {
    _id
    name
    fields {
      type
      label
      value
      variableName
      placeholder
      hint
      height
      required
      chapter
      question
      questionNumber
      consistencyCondition
      inconsistencyMessage
      errorType
      description
      requirementLevel
      options {
        label
        value
      }
      disabled
      readonly
      name
      specificType
      color
      rules
    }
    createdBy {
      name
      email
    }
    createdAt
  }
}
    `;
export const CreateProtocolDocument = gql`
    mutation CreateProtocol($createProtocolInput: CreateProtocolInput!) {
  createProtocol(createProtocolInput: $createProtocolInput) {
    _id
    courseId
    name
    module
    formId
    createdAt
  }
}
    `;
export const FormDocument = gql`
    query Form($id: String!) {
  form(id: $id) {
    _id
    name
    fields {
      type
      label
      value
      variableName
      placeholder
      hint
      height
      required
      chapter
      question
      questionNumber
      consistencyCondition
      inconsistencyMessage
      errorType
      description
      requirementLevel
    }
    createdBy {
      name
      email
    }
    createdAt
  }
}
    `;
export const FormsDocument = gql`
    query Forms {
  forms {
    _id
    name
    createdBy {
      name
      email
    }
    createdAt
  }
}
    `;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      name
      email
      role
    }
  }
}
    `;
export const MeDocument = gql`
    query Me {
  me {
    _id
    name
    email
    role
  }
}
    `;
export const ProtocolDocument = gql`
    query Protocol($id: String!) {
  protocol(id: $id) {
    _id
    courseId
    name
    module
    formId
    createdAt
  }
}
    `;
export const ProtocolsDocument = gql`
    query Protocols($courseId: String!) {
  protocols(courseId: $courseId) {
    _id
    courseId
    name
    module
    formId
    createdAt
  }
}
    `;
export const CreateUserDocument = gql`
    mutation CreateUser($createUserInput: CreateUserInput!) {
  createUser(createUserInput: $createUserInput) {
    token
    user {
      name
      email
      role
    }
  }
}
    `;
export const SubmissionsDocument = gql`
    query Submissions($protocolId: String!) {
  submissions(protocolId: $protocolId) {
    _id
    protocolId
    formId
    data
    submittedBy
    createdAt
  }
}
    `;
export const SubmitProtocolDocument = gql`
    mutation SubmitProtocol($createSubmissionInput: CreateSubmissionInput!) {
  submitProtocol(createSubmissionInput: $createSubmissionInput) {
    _id
    protocolId
    formId
    data
    submittedBy
    createdAt
  }
}
    `;
export const UpdateUserDocument = gql`
    mutation UpdateUser($updateUserInput: UpdateUserInput!) {
  updateUser(updateUserInput: $updateUserInput) {
    _id
    name
    email
    role
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Course(variables: CourseQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CourseQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CourseQuery>({ document: CourseDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Course', 'query', variables);
    },
    Courses(variables?: CoursesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CoursesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CoursesQuery>({ document: CoursesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Courses', 'query', variables);
    },
    CreateCourse(variables: CreateCourseMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateCourseMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateCourseMutation>({ document: CreateCourseDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateCourse', 'mutation', variables);
    },
    CreateForm(variables: CreateFormMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateFormMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateFormMutation>({ document: CreateFormDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateForm', 'mutation', variables);
    },
    CreateProtocol(variables: CreateProtocolMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateProtocolMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateProtocolMutation>({ document: CreateProtocolDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateProtocol', 'mutation', variables);
    },
    Form(variables: FormQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<FormQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FormQuery>({ document: FormDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Form', 'query', variables);
    },
    Forms(variables?: FormsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<FormsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FormsQuery>({ document: FormsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Forms', 'query', variables);
    },
    Login(variables: LoginMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<LoginMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoginMutation>({ document: LoginDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Login', 'mutation', variables);
    },
    Me(variables?: MeQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<MeQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MeQuery>({ document: MeDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Me', 'query', variables);
    },
    Protocol(variables: ProtocolQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ProtocolQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProtocolQuery>({ document: ProtocolDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Protocol', 'query', variables);
    },
    Protocols(variables: ProtocolsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ProtocolsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProtocolsQuery>({ document: ProtocolsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Protocols', 'query', variables);
    },
    CreateUser(variables: CreateUserMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateUserMutation>({ document: CreateUserDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateUser', 'mutation', variables);
    },
    Submissions(variables: SubmissionsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<SubmissionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SubmissionsQuery>({ document: SubmissionsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Submissions', 'query', variables);
    },
    SubmitProtocol(variables: SubmitProtocolMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<SubmitProtocolMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SubmitProtocolMutation>({ document: SubmitProtocolDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'SubmitProtocol', 'mutation', variables);
    },
    UpdateUser(variables: UpdateUserMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateUserMutation>({ document: UpdateUserDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateUser', 'mutation', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;