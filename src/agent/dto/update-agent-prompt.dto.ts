import { PartialType } from '@nestjs/mapped-types';

import { CreateAgentPromptDto } from './create-agent-prompt.dto';

export class UpdateAgentPromptDto extends PartialType(CreateAgentPromptDto) {}
