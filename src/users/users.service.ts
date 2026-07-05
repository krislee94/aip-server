import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';

import { RegisterDto } from '../auth/dto/register.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(dto: RegisterDto): Promise<User> {
    const existing = await this.usersRepository.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const user = this.usersRepository.create({
      email: dto.email,
      name: dto.name,
      passwordHash: await hash(dto.password, 12),
    });

    return this.usersRepository.save(user);
  }

  findByEmailForAuth(email: string): Promise<User | null> {
    return this.usersRepository.findByEmailForAuth(email);
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }
}
