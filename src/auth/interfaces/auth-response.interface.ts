export interface AuthUser {
  email: string;
  id: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
  user: AuthUser;
}
