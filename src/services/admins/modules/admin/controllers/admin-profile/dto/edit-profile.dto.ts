import { PartialType, PickType } from '@nestjs/swagger';
import { Admin } from '@common';

export class EditProfileDto extends PartialType(PickType(Admin, ['name', 'profilePictureUrl'] as const)) {}
