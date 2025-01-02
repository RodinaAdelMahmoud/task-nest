import { PartialType, PickType } from '@nestjs/swagger';
import { AdminRole } from '@common';

export class UpdateRoleBodyDto extends PartialType(PickType(AdminRole, ['permissions'] as const)) {}
