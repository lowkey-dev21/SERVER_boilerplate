export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  // Add other user properties as needed
}
