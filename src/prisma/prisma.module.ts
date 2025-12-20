import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { LoggerModule } from './../logging/logging.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [LoggerModule, ConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
