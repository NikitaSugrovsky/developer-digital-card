import { Field, ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType('Project')
export class ProjectObject {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => String, { nullable: true })
  projectUrl!: string | null;

  @Field(() => String, { nullable: true })
  repositoryUrl!: string | null;

  @Field(() => [String])
  technologies!: string[];

  @Field(() => ID)
  profileId!: string;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}