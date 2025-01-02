import { AdminPermissions } from '@common/schemas/mongoose/admin/admin-permissions';
import { BaseJwtPersona, PersonaTypeEnum } from './base-jwt-persona.interface';
import { LocalizedText } from '@common/schemas/mongoose/common/localized-text';

export interface AdminJwtPersona extends BaseJwtPersona {
  type: PersonaTypeEnum.ADMIN;
  name: LocalizedText;
  email: string;
  permissions: AdminPermissions;
}
