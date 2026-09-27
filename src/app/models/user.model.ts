export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email?: string;
  role: UserRole;
  created_at?: string;
}
