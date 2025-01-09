import { EnvironmentEnum } from '@common/enums';
import { UserJwtPersona } from '@common/interfaces/jwt-persona';
import { PersonaTypeEnum } from '@common/interfaces/jwt-persona/base-jwt-persona.interface';
import { AppConfig } from '@common/modules/env-config/services/app-config';
import * as logDNA from '@logdna/logger';
import { ConsoleLogger, Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { Request } from 'express';
import * as os from 'os';
import { Logger as WinstonLogger, createLogger, format, transports } from 'winston';
import * as Transport from 'winston-transport';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService extends ConsoleLogger {
  private localeStringOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    day: '2-digit',
    month: '2-digit',
  };

  private colorizer = format.colorize({ all: true });
  private customFormat = (isColored = false) =>
    format.combine(
      format.timestamp(),
      format.json(),
      format.prettyPrint(),
      ...(isColored ? [this.colorizer] : []),
      format.printf(({ timestamp, level, message }) => {
        const formattedPID = `[Nest] ${process.pid}  - `;
        const formattedDate = new Date(timestamp).toLocaleString(undefined, this.localeStringOptions);

        return `${this.colorizer.colorize(this.decolorize(level), formattedPID)}${formattedDate}    ${level} [${
          this.context
        }] ${message}`;
      }),
    );

  private winstonInstance: WinstonLogger;

  constructor(@Inject(INQUIRER) private parentClass: object, private appConfig: AppConfig) {
    super();
    this.setContext(this.parentClass?.constructor?.name);
    const appName = `od-${this.appConfig.NODE_ENV}-backend`;

    let macAddress = '';
    let ipAddress = '';
    const networkInterfaces = os.networkInterfaces();

    for (const iface of Object.values(networkInterfaces)) {
      if (iface?.[0]) {
        macAddress = iface[0].mac;
        ipAddress = iface[0].address;
        break;
      }
    }

    const logger = logDNA.createLogger(this.appConfig.LOGDNA_KEY, {
      hostname: appName,
      mac: macAddress,
      ip: ipAddress,
      app: appName,
      env: this.appConfig.NODE_ENV,
      indexMeta: true,
      levels: ['debug', 'info', 'warn', 'error', 'verbose'],
    });

    this.winstonInstance = createLogger({
      exitOnError: false,
      format: this.customFormat(true),
      transports: [
        new transports.Console(),
        ...(this.appConfig.NODE_ENV !== EnvironmentEnum.LOCAL
          ? [
              new Transport({
                log: ({ message, level, metadata }, callback) => {
                  logger.log(message, { level: this.decolorize(level), ...(metadata && { meta: metadata }) });
                  callback();
                },
              }),
            ]
          : []),
      ],
      levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4 },
    });
  }

  log(message: any, optionalParams?: any) {
    this.winstonInstance.log('info', message, {
      metadata: { context: this.context, ...optionalParams },
    });
  }

  error(message: any, optionalParams?: any) {
    this.winstonInstance.log('error', message, {
      metadata: { context: this.context, ...optionalParams },
    });
  }

  warn(message: any, optionalParams?: any) {
    this.winstonInstance.log('warn', message, {
      metadata: { context: this.context, ...optionalParams },
    });
  }

  debug(message: any, optionalParams?: any) {
    this.winstonInstance.log('debug', message, {
      metadata: { context: this.context, ...optionalParams },
    });
  }

  verbose(message: any, optionalParams?: any) {
    this.winstonInstance.log('verbose', message, {
      metadata: { context: this.context, ...optionalParams },
    });
  }

  generateLogMessage(req: Request, resStatusCode: number) {
    const { method, url, persona } = req;
    const personaInfo = this.isPersonaUser(persona) ? persona.email : '(Unknown Persona)';

    return `${personaInfo} hit ${method} ${url} with status code ${resStatusCode}`;
  }

  private isPersonaUser(persona: any): persona is UserJwtPersona {
    return !!(persona?.type === PersonaTypeEnum.USER);
  }

  private decolorize(message: string) {
    return message.replace(
      new RegExp(
        [
          '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
          '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))',
        ].join('|'),
        'g',
      ),
      '',
    );
  }
}
