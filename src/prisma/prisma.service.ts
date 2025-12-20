import {
  INestApplication,
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { PrismaClient } from './../../generated/prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly _logger: Logger,
  ) {
    super({
      datasources:
        configService.get('NODE_ENV') != 'local'
          ? { db: { url: configService.get<string>('DATABASE_URL') } }
          : undefined,
      log: [
        { level: 'info', emit: 'stdout' },
        { level: 'query', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
        { level: 'error', emit: 'stdout' },
      ],
    });
    // Context binding
    this.loggingMiddleware = this.loggingMiddleware.bind(this);
  }
  async onModuleInit() {
    await this.$connect();
    this._logger.info('Database connected', { context: PrismaService.name });
    // this.$use(this.loggingMiddleware);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', () => {
      app.close();
    });
  }

  async runMigrations() {
    return new Promise((resolve) => {
      exec(
        'npm run migrations:prod',
        { maxBuffer: 1024 * 500 },
        (error, stdout) => {
          if (error)
            this._logger.error(`${error}`, { context: PrismaService.name });
          else if (stdout)
            this._logger.error(`${stdout}`, { context: PrismaService.name });
          else this._logger.error(`${stdout}`, { context: PrismaService.name });
          resolve(stdout ? true : false);
        },
      );
    });
  }

  loggingMiddleware(params: any, next: any) {
    const before = Date.now();
    const result = next(params);
    const after = Date.now();

    const log = `Query ${params.model}.${params.action} took ${after - before}ms`;
    this._logger.info(log, { context: PrismaService.name });
    return result;
  }
}
