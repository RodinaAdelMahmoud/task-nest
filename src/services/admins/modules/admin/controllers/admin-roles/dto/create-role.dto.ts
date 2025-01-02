import { PickType } from '@nestjs/swagger';
import { AdminRole } from '@common';

export class CreateRoleDto extends PickType(AdminRole, ['name', 'permissions'] as const) {}
