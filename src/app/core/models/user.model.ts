export type UserRole = 'ADMIN' | 'MANAGER' | 'USER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  token?: string;
}
