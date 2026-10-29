import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectObject } from './dto/project.object';
import { entityNotFound } from '../common/errors';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ProjectObject[]> {
    return this.prisma.project.findMany({
      orderBy: { name: 'asc' },
    }) as unknown as ProjectObject[];
  }

  async findById(id: string): Promise<ProjectObject> {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw entityNotFound('Project', id);
    return project as unknown as ProjectObject;
  }
}