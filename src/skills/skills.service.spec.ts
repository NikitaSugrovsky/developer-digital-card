import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SkillsService', () => {
  let service: SkillsService;
  let prisma: {
    skill: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = { skill: { findMany: jest.fn(), findUnique: jest.fn() } };

    const moduleRef = await Test.createTestingModule({
      providers: [SkillsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = moduleRef.get(SkillsService);
  });

  it('findAll returns skills', async () => {
    prisma.skill.findMany.mockResolvedValue([
      { id: '1', name: 'A', category: 'Backend', level: 'beginner' },
      { id: '2', name: 'B', category: 'Backend', level: 'intermediate' },
    ]);

    const result = await service.findAll();
    expect(result).toHaveLength(2);
    expect(prisma.skill.findMany).toHaveBeenCalledTimes(1);
  });

  it('findById throws NotFoundException for unknown id', async () => {
    prisma.skill.findUnique.mockResolvedValue(null);
    await expect(service.findById('nope')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('findById returns skill when present', async () => {
    prisma.skill.findUnique.mockResolvedValue({ id: '1', name: 'A', category: 'Backend', level: 'beginner' });
    const result = await service.findById('1');
    expect(result.name).toBe('A');
  });
});