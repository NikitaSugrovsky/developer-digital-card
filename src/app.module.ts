import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { HttpException } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { SkillsModule } from './skills/skills.module';
import { ExperienceModule } from './experience/experience.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get<string>('NODE_ENV') === 'production';
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          playground: false,
          introspection: !isProd,
          csrfPrevention: false,
          plugins: isProd ? [] : [ApolloServerPluginLandingPageLocalDefault({ footer: false })],
          formatError: (formattedError) => {
            const originalError = formattedError.extensions?.originalError as
              | { statusCode?: number; message?: string | string[] }
              | undefined;

            if (originalError?.statusCode === 404) {
              return {
                ...formattedError,
                extensions: {
                  ...formattedError.extensions,
                  code: 'NOT_FOUND',
                },
              };
            }
            return formattedError;
          },
        };
      },
    }),
    PrismaModule,
    ProfileModule,
    SkillsModule,
    ExperienceModule,
    ProjectsModule,
  ],
})
export class AppModule {}