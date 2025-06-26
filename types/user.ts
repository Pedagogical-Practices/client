export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface CreateUserResponse {
  createUser: {
    token: string;
    user: User;
  };
}

export interface LoginResponse {
  login: {
    token: string;
    user: User;
  };
}

export interface UpdateUserResponse {
  updateUser: User;
}

export interface MeResponse {
  me: User | null;
}

export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}
