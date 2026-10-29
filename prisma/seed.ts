import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PROFILE_EMAIL = 'nikita@example.com';

const SKILLS = [
  { name: 'TypeScript',      category: 'Backend',  level: 'intermediate' },
  { name: 'Node.js',         category: 'Backend',  level: 'intermediate' },
  { name: 'NestJS',          category: 'Backend',  level: 'beginner' },
  { name: 'GraphQL',         category: 'Backend',  level: 'beginner' },
  { name: 'Prisma',          category: 'Database', level: 'beginner' },
  { name: 'PostgreSQL',      category: 'Database', level: 'intermediate' },
  { name: 'Docker',          category: 'DevOps',   level: 'beginner' },
  { name: 'Git',             category: 'Tools',    level: 'intermediate' },
  { name: 'Python',          category: 'Backend',  level: 'intermediate' },
  { name: 'AI integrations', category: 'Backend',  level: 'intermediate' },
];

async function main(): Promise<void> {
  console.log('Seeding database...');

  const profile = await prisma.profile.upsert({
    where: { email: PROFILE_EMAIL },
    update: {
      name: 'Никита',
      description:
        'Backend-разработчик, работающий над веб-платформами, автоматизацией обработки данных и интеграцией AI-сервисов.',
    },
    create: {
      name: 'Никита',
      description:
        'Backend-разработчик, работающий над веб-платформами, автоматизацией обработки данных и интеграцией AI-сервисов.',
      email: PROFILE_EMAIL,
      githubUrl: null,
      linkedinUrl: null,
    },
  });

  for (const skill of SKILLS) {
    await prisma.skill.upsert({
      where: { profileId_name: { profileId: profile.id, name: skill.name } },
      update: { category: skill.category, level: skill.level ?? null },
      create: {
        name: skill.name,
        category: skill.category,
        level: skill.level ?? null,
        profileId: profile.id,
      },
    });
  }

  const startDate = new Date('2023-01-01T00:00:00.000Z');

  await prisma.experience.upsert({
    where: {
      profileId_company_position_startDate: {
        profileId: profile.id,
        company: 'Всероссийский центр национальной строительной политики',
        position: 'Backend-разработчик',
        startDate,
      },
    },
    update: {
      endDate: null,
      description:
        'Разработка платформы для девелоперов, сравнение перечней строительной документации и автоматизация сверки документов.',
      achievements: [],
    },
    create: {
      company: 'Всероссийский центр национальной строительной политики',
      position: 'Backend-разработчик',
      startDate,
      endDate: null,
      description:
        'Разработка платформы для девелоперов, сравнение перечней строительной документации и автоматизация сверки документов.',
      achievements: [],
      profileId: profile.id,
    },
  });

  const projects = [
    {
      name: 'mindAI',
      description:
        'AI-сервис с backend, базой данных, интеграцией языковых моделей и системой долговременной памяти.',
      projectUrl: null,
      repositoryUrl: null,
      technologies: ['TypeScript', 'Node.js', 'PostgreSQL', 'LLM API'],
    },
    {
      name: 'Платформа автоматизации проверки строительной документации',
      description:
        'Сервис сравнения перечней строительной документации и автоматической сверки документов для девелоперов.',
      projectUrl: null,
      repositoryUrl: null,
      technologies: ['Python', 'PostgreSQL', 'Docker'],
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { profileId_name: { profileId: profile.id, name: project.name } },
      update: {
        description: project.description,
        projectUrl: project.projectUrl,
        repositoryUrl: project.repositoryUrl,
        technologies: project.technologies,
      },
      create: { ...project, profileId: profile.id },
    });
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });