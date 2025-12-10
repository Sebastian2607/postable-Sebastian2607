export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  username: string;
  email: string;
  password: string;
}

export interface UpdatedUser {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}