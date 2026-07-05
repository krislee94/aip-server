import { PartialType, PickType } from '@nestjs/mapped-types';

import { BindAgentMcpDto } from './bind-agent-mcp.dto';

export class UpdateAgentMcpBindingDto extends PartialType(
  PickType(BindAgentMcpDto, [
    'allowTools',
    'denyTools',
    'enableFlag',
    'sort',
  ] as const),
) {}
