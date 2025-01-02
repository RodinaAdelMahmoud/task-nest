import { ApiProperty, ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Types } from 'mongoose';
import { User } from '@common/schemas/mongoose/user';

export class EditProfileDto extends PartialType(PickType(User, ['profilePictureUrl'] as const)) {
  @ApiPropertyOptional({ description: 'URL for the profile picture', example: 'https://cdn.pixabay.com' })
  profilePictureUrl?: string;
}
