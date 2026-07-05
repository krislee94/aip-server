import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

const normalizeEmail = (value: unknown): unknown =>
  typeof value === 'string' ? value.toLowerCase().trim() : value;

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class RegisterDto {
  @IsEmail()
  @Transform(({ value }: { value: unknown }) => normalizeEmail(value))
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }: { value: unknown }) => trimString(value))
  name: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}
