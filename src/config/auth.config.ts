import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  jwtExpiresIn: string;
  jwtSecret: string;
}

export const buildAuthConfig = (): AuthConfig => ({
  jwtSecret:
    process.env.JWT_SECRET ?? 'dev-jwt-secret-change-me-at-least-32-characters',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
});

export default registerAs('auth', buildAuthConfig);
