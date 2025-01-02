import { EnvironmentEnum } from '@common/enums';
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpClassValidatorPipe } from '@common/pipes';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { useContainer } from 'class-validator';
import { BootstrapOptions } from '@common/interfaces/app-bootstrap';
import { AppConfig } from '@common/modules/env-config/services/app-config';
import { CustomLoggerService } from '@common/modules/common/services/logger';
import { DebugConfig } from '@common/interfaces/debug';

export async function appBootstrapLoader(
  AppModule: any,
  options: BootstrapOptions,
  _debugOptions?: DebugConfig,
): Promise<void> {
  const { swagger } = options;

  const app = await NestFactory.create(AppModule);

  const appConfig = app.get(AppConfig);

  const debugOptions = appConfig.NODE_ENV !== EnvironmentEnum.LOCAL ? undefined : _debugOptions;

  const logger = await app.resolve(CustomLoggerService);
  app.useLogger(logger);

  const appShortName = 'Task-backend';

  app.setGlobalPrefix(appShortName);
  app.useGlobalPipes(HttpClassValidatorPipe);

  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'x-api-version',
    defaultVersion: '1',
  });
  app.enableCors({
    origin: true,
    methods: '*',
    allowedHeaders: '*',
    optionsSuccessStatus: 204,
  });

  if (swagger.enabled && appConfig.NODE_ENV !== EnvironmentEnum.PROD) {
    const { title = appShortName, version, description } = swagger.config;
    const config = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description ?? '')
      .setVersion(version)
      .addGlobalParameters({
        name: 'x-api-version',
        in: 'header',
        description: 'API version',
        required: true,
        schema: {
          type: 'string',
          default: '1',
        },
      })
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(`${appShortName}/docs`, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
    app.use('/api-json', (req, res) => {
      res.send(document);
    });
  }

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(debugOptions?.port ?? 3000);

  return;
}
