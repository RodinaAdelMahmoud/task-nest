import { IsOptional, IsString } from "class-validator";

export class ListAllAdminsForList {
    @IsOptional()
    @IsString()
    search?: string;
  }