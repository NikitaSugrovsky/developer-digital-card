import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileObject } from './dto/profile.object';
import { profileNotFound } from '../common/errors';
import { SkillObject } from '../skills/dto/skill.object';
import { ExperienceObject } from '../experience/dto/experience.object';
import { ProjectObject } from '../projects/dto/project.object';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(): Promise<ProfileObject> {
    const profile = await this.prisma.profile.findFirst({
      include: {
        skills: true,
        experience: { orderBy: { startDate: 'desc' } },
        projects: { orderBy: { name: 'asc' } },
      },
    });

    if (!profile) {
      throw profileNotFound();
    }
    return profile as unknown as ProfileObject;
  }

  async getProfileById(id: string): Promise<ProfileObject> {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: {
        skills: true,
        experience: { orderBy: { startDate: 'desc' } },
        projects: { orderBy: { name: 'asc' } },
      },
    });

    if (!profile) {
      throw profileNotFound();
    }
    return profile as unknown as ProfileObject;
  }

  getSkillsOf(parent: ProfileObject): SkillObject[] {
    return parent.skills;
  }

  getExperienceOf(parent: ProfileObject): ExperienceObject[] {
    return parent.experience;
  }

  getProjectsOf(parent: ProfileObject): ProjectObject[] {
    return parent.projects;
  }
}