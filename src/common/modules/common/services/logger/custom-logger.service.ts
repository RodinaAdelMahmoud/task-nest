import { EnvironmentEnum } from '@common/enums';
import { UserJwtPersona, AdminJwtPersona, ServiceProviderJwtPersona } from '@common/interfaces/jwt-persona';
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

    let macAddress: string;
    let ipAddress: string;
    if (os.networkInterfaces().eth0?.length > 0) {
      macAddress = os.networkInterfaces().eth0[0].mac;
      ipAddress = os.networkInterfaces().eth0[0].address;
    } else if (os.networkInterfaces()['Ethernet']?.length > 0) {
      macAddress = os.networkInterfaces()['Ethernet'][1].mac;
      ipAddress = os.networkInterfaces()['Ethernet'][1].address;
    } else if (os.networkInterfaces()['Wi-Fi']?.length > 0) {
      macAddress = os.networkInterfaces()['Wi-Fi'][1].mac;
      ipAddress = os.networkInterfaces()['Wi-Fi'][1].address;
    } else {
      macAddress = '';
      ipAddress = '';
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
                  logger.log(message, { level: this.decolorize(level), ...(!!metadata && { meta: metadata }) });
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
      metadata: {
        context: this.context,
        ...optionalParams,
      },
    });
  }

  error(message: any, optionalParams?: any) {
    const errorMessage = message;

    this.winstonInstance.log('error', errorMessage, {
      metadata: {
        context: this.context,
        ...optionalParams,
      },
    });
  }

  warn(message: any, optionalParams?: any) {
    this.winstonInstance.log('warn', message, {
      metadata: {
        context: this.context,
        ...optionalParams,
      },
    });
  }

  debug(message: any, optionalParams?: any) {
    this.winstonInstance.log('debug', message, {
      metadata: {
        context: this.context,
        ...optionalParams,
      },
    });
  }

  verbose(message: any, optionalParams?: any) {
    this.winstonInstance.log('verbose', message, {
      metadata: {
        context: this.context,
        ...optionalParams,
      },
    });
  }

  generateLogMessage(req: Request, resStatusCode: number) {
    const { method, url, persona } = req;

    const personaWithRole = this.getPersonaWithRole(persona);

    return `${personaWithRole} hit ${method} ${url} with status code ${resStatusCode}`;
  }

  getPersonaWithRole(persona: UserJwtPersona | AdminJwtPersona | ServiceProviderJwtPersona) {
    const role = this.getRole(persona);

    if (this.isPersonaUser(persona)) {
      return `${role} ${persona.email}`;
    } else if (this.isPersonaAdmin(persona)) {
      return `${role} ${persona.name.ar} ${persona.name.en}`;
    } else {
      return '(Unknown Persona)';
    }
  }

  getRole(persona: UserJwtPersona | AdminJwtPersona | ServiceProviderJwtPersona) {
    if (this.isPersonaUser(persona)) {
      return PersonaTypeEnum.USER;
    } else if (this.isPersonaAdmin(persona)) {
      return PersonaTypeEnum.ADMIN;
    } else {
      return 'unknown';
    }
  }

  private isPersonaUser(persona: any): persona is UserJwtPersona {
    return !!(persona?.type === PersonaTypeEnum.USER);
  }

  private isPersonaAdmin(persona: any): persona is AdminJwtPersona {
    return !!(persona?.type === PersonaTypeEnum.ADMIN);
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
