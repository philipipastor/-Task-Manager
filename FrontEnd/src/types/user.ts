import {type UserRole } from "./userRole"

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthResponse = {
  user: User;
  token: string;
};