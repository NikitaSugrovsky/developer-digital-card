import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { ProfileObject } from './dto/profile.object';
import { SkillObject } from '../skills/dto/skill.object';
import { ExperienceObject } from '../experience/dto/experience.object';
import { ProjectObject } from '../projects/dto/project.object';

@Resolver(() => ProfileObject)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => ProfileObject, { name: 'profile', description: 'Профиль разработчика' })
  profile(): Promise<ProfileObject> {
    return this.profileService.getProfile();
  }

  @Query(() => ProfileObject, { name: 'profileById' })
  profileById(@Args('id', { type: () => ID }) id: string): Promise<ProfileObject> {
    return this.profileService.getProfileById(id);
  }

  @ResolveField(() => [SkillObject])
  skills(@Parent() parent: ProfileObject): SkillObject[] {
    return this.profileService.getSkillsOf(parent);
  }

  @ResolveField(() => [ExperienceObject])
  experience(@Parent() parent: ProfileObject): ExperienceObject[] {
    return this.profileService.getExperienceOf(parent);
  }

  @ResolveField(() => [ProjectObject])
  projects(@Parent() parent: ProfileObject): ProjectObject[] {
    return this.profileService.getProjectsOf(parent);
  }
}