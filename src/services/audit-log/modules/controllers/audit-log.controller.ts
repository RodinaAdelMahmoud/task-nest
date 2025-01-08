import { Controller, Get } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  // Endpoint to get all audit logs
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all audit logs' })
  @Get('history')
  async getAllAuditLogs() {
    const logs = await this.auditLogService.getAllAuditLogs();
    return { auditLogs: logs };
  }
}
