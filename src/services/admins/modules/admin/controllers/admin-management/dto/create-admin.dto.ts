import { ApiProperty, PickType } from '@nestjs/swagger';
import { Admin, TransformObjectId } from '@common';
import { IsInstance } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAdminDto extends PickType(Admin, ['email', 'name', 'password'] as const) {
  @IsInstance(Types.ObjectId)
  @TransformObjectId()
  @ApiProperty({ type: String })
  roleId: Types.ObjectId;
}
