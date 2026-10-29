import { Field, ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';
import { SkillObject } from '../../skills/dto/skill.object';
import { ExperienceObject } from '../../experience/dto/experience.object';
import { ProjectObject } from '../../projects/dto/project.object';

@ObjectType('Profile')
export class ProfileObject {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => String, { nullable: true })
  email!: string | null;

  @Field(() => String, { nullable: true })
  githubUrl!: string | null;

  @Field(() => String, { nullable: true })
  linkedinUrl!: string | null;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @Field(() => [SkillObject])
  skills!: SkillObject[];

  @Field(() => [ExperienceObject])
  experience!: ExperienceObject[];

  @Field(() => [ProjectObject])
  projects!: ProjectObject[];
}