import { Module } from '@nestjs/common';
import { ExperienceResolver } from './experience.resolver';
import { ExperienceService } from './experience.service';

@Module({
  providers: [ExperienceResolver, ExperienceService],
})
export class ExperienceModule {}