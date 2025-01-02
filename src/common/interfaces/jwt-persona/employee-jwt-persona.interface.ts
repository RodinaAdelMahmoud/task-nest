import { BaseJwtPersona, PersonaTypeEnum } from './base-jwt-persona.interface';

export interface EmployeeJwtPersona extends BaseJwtPersona {
  _id: string;
  email: string;
  permissions: object;

  type: PersonaTypeEnum.EMPLOYEE;
}
