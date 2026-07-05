import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMcpDto } from './dto/create-mcp.dto';
import { McpServer } from './entities/mcp.entity';

@Injectable()
export class McpRepository {
  constructor(
    @InjectRepository(McpServer)
    private readonly repository: Repository<McpServer>,
  ) {}

  create(dto: CreateMcpDto, creator: string, mcpCode: string): McpServer {
    return this.repository.create({
      ...dto,
      createdBy: creator,
      mcpCode,
      tenantId: creator,
    });
  }

  findAllByOwner(creator: string): Promise<McpServer[]> {
    return this.repository.find({
      order: {
        createdAt: 'DESC',
      },
      where: {
        createdBy: creator,
        isDeleted: false,
      },
    });
  }

  findByCode(tenantId: string, mcpCode: string): Promise<McpServer | null> {
    return this.repository.findOne({
      where: {
        isDeleted: false,
        mcpCode,
        tenantId,
      },
    });
  }

  findOneByIdAndOwner(id: string, creator: string): Promise<McpServer | null> {
    return this.repository.findOne({
      where: {
        createdBy: creator,
        id,
        isDeleted: false,
      },
    });
  }

  save(mcp: McpServer): Promise<McpServer> {
    return this.repository.save(mcp);
  }
}
