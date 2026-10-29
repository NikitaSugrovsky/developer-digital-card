import { Field, ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType('Skill')
export class SkillObject {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  category!: string;

  @Field(() => String, { nullable: true })
  level!: string | null;

  @Field(() => ID)
  profileId!: string;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}