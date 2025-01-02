import { BaseJwtPersona, PersonaTypeEnum } from './base-jwt-persona.interface';

export interface UserJwtPersona extends BaseJwtPersona {
  type: PersonaTypeEnum.USER;
  // firstName: string;
  // middleName?: string;
  // lastName?: string;
  email: string;
}
