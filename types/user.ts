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