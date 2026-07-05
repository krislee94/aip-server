import { PartialType } from '@nestjs/mapped-types';

import { BindAgentRelationDto } from './bind-agent-relation.dto';

export class UpdateAgentRelationDto extends PartialType(BindAgentRelationDto) {}
