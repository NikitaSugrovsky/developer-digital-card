import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { ExperienceService } from './experience.service';
import { ExperienceObject } from './dto/experience.object';

@Resolver(() => ExperienceObject)
export class ExperienceResolver {
  constructor(private readonly experienceService: ExperienceService) {}

  @Query(() => [ExperienceObject], { name: 'experience' })
  experience(): Promise<ExperienceObject[]> {
    return this.experienceService.findAll();
  }

  @Query(() => ExperienceObject, { name: 'experienceById' })
  experienceById(@Args('id', { type: () => ID }) id: string): Promise<ExperienceObject> {
    return this.experienceService.findById(id);
  }
}