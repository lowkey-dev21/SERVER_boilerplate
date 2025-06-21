export enum UserRole {
  ADMIN = "ADMIN",
  INSTRUCTOR = "INSTRUCTOR",
  STUDENT = "STUDENT",
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  // Add other user properties as needed
}
