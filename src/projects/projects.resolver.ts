import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { ProjectObject } from './dto/project.object';

@Resolver(() => ProjectObject)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => [ProjectObject], { name: 'projects' })
  projects(): Promise<ProjectObject[]> {
    return this.projectsService.findAll();
  }

  @Query(() => ProjectObject, { name: 'projectById' })
  projectById(@Args('id', { type: () => ID }) id: string): Promise<ProjectObject> {
    return this.projectsService.findById(id);
  }
}