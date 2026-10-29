import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let prisma: {
    profile: {
      findFirst: jest.Mock;
      findUnique: jest.Mock;
    };
  };

  const mockProfile = {
    id: 'p1',
    name: 'Никита',
    description: 'desc',
    email: 'nikita@example.com',
    githubUrl: null,
    linkedinUrl: null,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    skills: [{ id: 's1', name: 'TypeScript', category: 'Backend', level: 'intermediate' }],
    experience: [{ id: 'e1', company: 'C', position: 'P' }],
    projects: [{ id: 'pr1', name: 'mindAI' }],
  };

  beforeEach(async () => {
    prisma = {
      profile: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = moduleRef.get(ProfileService);
  });

  it('returns the profile with nested relations', async () => {
    prisma.profile.findFirst.mockResolvedValue(mockProfile);

    const result = await service.getProfile();

    expect(prisma.profile.findFirst).toHaveBeenCalledTimes(1);
    expect(result.name).toBe('Никита');
    expect(result.skills).toHaveLength(1);
    expect(result.experience).toHaveLength(1);
    expect(result.projects).toHaveLength(1);
  });

  it('throws NotFoundException when no profile exists', async () => {
    prisma.profile.findFirst.mockResolvedValue(null);

    await expect(service.getProfile()).rejects.toBeInstanceOf(NotFoundException);
  });

  it('getSkillsOf returns already-loaded skills without extra DB call', () => {
    const skills = service.getSkillsOf(mockProfile as never);
    expect(skills).toEqual(mockProfile.skills);
    expect(prisma.profile.findFirst).not.toHaveBeenCalled();
  });
});