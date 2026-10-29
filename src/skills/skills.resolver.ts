import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { SkillsService } from './skills.service';
import { SkillObject } from './dto/skill.object';

@Resolver(() => SkillObject)
export class SkillsResolver {
  constructor(private readonly skillsService: SkillsService) {}

  @Query(() => [SkillObject], { name: 'skills' })
  skills(): Promise<SkillObject[]> {
    return this.skillsService.findAll();
  }

  @Query(() => SkillObject, { name: 'skillById' })
  skillById(@Args('id', { type: () => ID }) id: string): Promise<SkillObject> {
    return this.skillsService.findById(id);
  }
}