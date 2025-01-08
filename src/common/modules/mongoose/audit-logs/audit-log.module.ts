import { FactoryProvider, Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getConnectionToken } from '@nestjs/mongoose';
import { MongooseCommonModule } from '../common';
import { auditLogSchemaFactory } from '@common/schemas/mongoose/audit-logs/audit-log.schema';
import { ModelNames } from '@common';

const AuditLogMongooseDynamicModule: FactoryProvider = {
  provide: ModelNames.AUDIT_LOG,
  inject: [getConnectionToken(), EventEmitter2],
  useFactory: auditLogSchemaFactory,
};

const auditLogProviders = [AuditLogMongooseDynamicModule];

@Module({
  imports: [MongooseCommonModule.forRoot()],
  providers: auditLogProviders,
  exports: auditLogProviders,
})
export class AuditLogMongooseModule {}
