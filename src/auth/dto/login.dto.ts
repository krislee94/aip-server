import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

const normalizeEmail = (value: unknown): unknown =>
  typeof value === 'string' ? value.toLowerCase().trim() : value;

export class LoginDto {
  @IsEmail()
  @Transform(({ value }: { value: unknown }) => normalizeEmail(value))
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}
