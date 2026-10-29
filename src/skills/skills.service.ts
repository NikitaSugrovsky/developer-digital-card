import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SkillObject } from './dto/skill.object';
import { entityNotFound } from '../common/errors';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SkillObject[]> {
    return this.prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    }) as unknown as SkillObject[];
  }

  async findById(id: string): Promise<SkillObject> {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) throw entityNotFound('Skill', id);
    return skill as unknown as SkillObject;
  }
}