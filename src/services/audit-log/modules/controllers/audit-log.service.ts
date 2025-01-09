import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from '@common/schemas/mongoose/audit-logs'; // Assuming you have this schema

@Injectable()
export class AuditLogService {
  constructor(@InjectModel('AuditLog') private auditLogModel: Model<AuditLog>) {}

  // Log task changes
  async logTaskChange(taskId: string, changeType: string, oldValue: string, newValue: string) {
    const logEntry = new this.auditLogModel({
      taskId,
      changeType,
      oldValue,
      newValue,
      timestamp: new Date(),
    });
    await logEntry.save();
  }

  // Get all audit logs
  async getAllAuditLogs(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const auditLogs = await this.auditLogModel
      .find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('modifiedBy', 'name');

    const totalAuditLogs = await this.auditLogModel.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalAuditLogs / limit);

    return {
      auditLogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalAuditLogs,
        limit,
      },
    };
  }
}
