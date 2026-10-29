import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExperienceObject } from './dto/experience.object';
import { entityNotFound } from '../common/errors';

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ExperienceObject[]> {
    return this.prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
    }) as unknown as ExperienceObject[];
  }

  async findById(id: string): Promise<ExperienceObject> {
    const item = await this.prisma.experience.findUnique({ where: { id } });
    if (!item) throw entityNotFound('Experience', id);
    return item as unknown as ExperienceObject;
  }
}