// import { Injectable } from '@nestjs/common';
// import { OnEvent } from '@nestjs/event-emitter';
// import { AuditLogService } from 'src/services/audit-log/audit-log.service'; // Ensure the correct path to AuditLogService
// import { CreateAuditLogDto } from 'src/services/audit-log/dto/create-audit-log.dto'; // Ensure correct path to CreateAuditLogDto

// @Injectable()
// export class TaskEventsListener {
//   constructor(private readonly auditLogService: AuditLogService) {}

//   @OnEvent('task.updated')
//   async handleTaskUpdatedEvent(payload: {
//     taskId: string;
//     modifiedBy: string;
//     field: string;
//     oldValue: string;
//     newValue: string;
//     type: string;
//   }) {
//     const createAuditLogDto = new CreateAuditLogDto(
//       payload.taskId,
//       payload.modifiedBy,
//       payload.type,
//       payload.oldValue,
//       payload.newValue,
//     );

//     // Call the method on AuditLogService to handle the creation of the audit log
//     await this.auditLogService.create(createAuditLogDto);
//   }
// }
