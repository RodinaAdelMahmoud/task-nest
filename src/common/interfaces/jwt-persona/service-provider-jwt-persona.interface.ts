export interface ServiceProviderJwtPersona {
  _id: string;
  email: string;
  sessionId: string;
  iat: number;
  exp: number;
}
