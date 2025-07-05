export const UserRoles = {
  ADMIN: 'admin',
  STUDENT: 'student',
  TEACHER_DIRECTIVE: 'teacher_directive',
  ADMINISTRATIVE: 'administrative',
  FAMILY: 'family',
  COORDINATOR: 'coordinator',
};

export interface UserDto {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password?: string; // Password might be optional if admin creates user without setting it initially
  role: string;
}

export interface UpdateUserInput {
  _id: string;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}