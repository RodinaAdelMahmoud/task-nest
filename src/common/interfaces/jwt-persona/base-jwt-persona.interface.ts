export enum PersonaTypeEnum {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  USER = 'user',
}

export interface BaseJwtPersona {
  _id: string;
  type: PersonaTypeEnum;
  sessionId: string;
  iat: number;
  exp: number;
}
