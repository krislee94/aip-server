import { PartialType, PickType } from '@nestjs/mapped-types';

import { BindAgentSkillDto } from './bind-agent-skill.dto';

export class UpdateAgentSkillBindingDto extends PartialType(
  PickType(BindAgentSkillDto, [
    'aliasName',
    'enableFlag',
    'invokeFilter',
    'sort',
  ] as const),
) {}
