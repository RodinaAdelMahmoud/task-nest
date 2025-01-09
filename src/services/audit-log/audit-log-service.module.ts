// audit-log.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLogSchema } from '@common/schemas/mongoose/audit-logs/audit-log.schema';
import { ModelNames } from '@common';
import { AuditLogController } from './modules/controllers/audit-log.controller';
import { AuditLogService } from './modules/controllers/audit-log.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: ModelNames.AUDIT_LOG, schema: AuditLogSchema }])],
  controllers: [AuditLogController],
  providers: [AuditLogService],
  exports: [AuditLogService], // Exporting the service
})
export class AuditLogModule {}
