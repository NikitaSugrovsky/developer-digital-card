import { Module } from '@nestjs/common';
import { SkillsResolver } from './skills.resolver';
import { SkillsService } from './skills.service';

@Module({
  providers: [SkillsResolver, SkillsService],
})
export class SkillsModule {}