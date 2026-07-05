import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { CreateMcpDto } from './dto/create-mcp.dto';
import { McpResponseDto } from './dto/mcp-response.dto';
import { UpdateMcpDto } from './dto/update-mcp.dto';
import { McpServer } from './entities/mcp.entity';
import { McpRepository } from './mcp.repository';

@Injectable()
export class McpService {
  constructor(private readonly mcpRepository: McpRepository) {}

  async create(
    createMcpDto: CreateMcpDto,
    creator: string,
  ): Promise<McpResponseDto> {
    const mcpCode =
      createMcpDto.mcpCode ?? this.generateCode(createMcpDto.mcpName, 'mcp');
    await this.ensureUniqueCode(creator, mcpCode);

    const mcp = this.mcpRepository.create(createMcpDto, creator, mcpCode);
    return new McpResponseDto(await this.mcpRepository.save(mcp));
  }

  async findAll(creator: string): Promise<McpResponseDto[]> {
    const servers = await this.mcpRepository.findAllByOwner(creator);
    return servers.map((mcp) => new McpResponseDto(mcp));
  }

  async findOne(id: string, creator: string): Promise<McpResponseDto> {
    return new McpResponseDto(await this.findOwnedMcp(id, creator));
  }

  async update(
    id: string,
    updateMcpDto: UpdateMcpDto,
    updater: string,
  ): Promise<McpResponseDto> {
    const mcp = await this.findOwnedMcp(id, updater);

    if (updateMcpDto.mcpCode && updateMcpDto.mcpCode !== mcp.mcpCode) {
      await this.ensureUniqueCode(updater, updateMcpDto.mcpCode);
    }

    Object.assign(mcp, updateMcpDto, {
      updatedBy: updater,
    });

    return new McpResponseDto(await this.mcpRepository.save(mcp));
  }

  async remove(id: string, updater: string): Promise<void> {
    const mcp = await this.findOwnedMcp(id, updater);
    mcp.isDeleted = true;
    mcp.updatedBy = updater;

    await this.mcpRepository.save(mcp);
  }

  private async ensureUniqueCode(
    tenantId: string,
    mcpCode: string,
  ): Promise<void> {
    const existing = await this.mcpRepository.findByCode(tenantId, mcpCode);

    if (existing) {
      throw new ConflictException('MCP code already exists');
    }
  }

  private async findOwnedMcp(id: string, creator: string): Promise<McpServer> {
    const mcp = await this.mcpRepository.findOneByIdAndOwner(id, creator);

    if (!mcp) {
      throw new NotFoundException('MCP server not found');
    }

    return mcp;
  }

  private generateCode(name: string, fallback: string): string {
    const normalized = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 40);
    const prefix = normalized || fallback;
    const suffix = randomUUID().replace(/-/g, '').slice(0, 10);

    return `${prefix}_${suffix}`.slice(0, 64);
  }
}
