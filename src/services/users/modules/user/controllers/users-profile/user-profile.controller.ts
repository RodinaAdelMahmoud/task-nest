import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BasePaginationQuery, CustomResponse, UserJwtPersona, Persona } from '@common';
import { UserJwtDecodeGuard, UserSuspendedGuard } from 'src/services/authentication/modules/user/controllers';
import { UserProfilesService } from './user-profile.service';
import { ChangeUserPasswordDto } from '../shared/dto/employees-profile/change-password.dto';

@Controller('user')
@ApiTags('User - Profile')
export class UserProfilesController {
  constructor(private readonly userProfilesService: UserProfilesService) {}

  // @Get('user/private/profile')
  // @ApiBearerAuth()
  // @UseGuards(UserJwtDecodeGuard)
  // @UseGuards(UserSuspendedGuard)
  // async getUserProfile(@Persona() userJWT: UserJwtPersona) {
  //   const user = await this.userProfilesService.getUserProfile(userJWT._id);

  //   return new CustomResponse().success({
  //     payload: { data: user },
  //   });
  // }

  // @Patch('user/private/profile')
  // @ApiBearerAuth()
  // @UseGuards(UserJwtDecodeGuard)
  // @UseGuards(UserSuspendedGuard)
  // async editProfile(@Persona() userJWT: UserJwtPersona, @Body() body: EditProfileDto) {
  //   const user = await this.userProfilesService.editProfile(userJWT._id, body);

  //   return new CustomResponse().success({
  //     payload: { data: user },
  //   });
  // }

  // @Patch('user/private/profile/change-password')
  // @ApiBearerAuth()
  // @UseGuards(UserJwtDecodeGuard)
  // @UseGuards(UserSuspendedGuard)
  // async changePassword(@Persona() userJWT: UserJwtPersona, @Body(ValidationPipe) body: ChangeUserPasswordDto) {
  //   const lawyer = await this.userProfilesService.changePassword(userJWT._id, body);

  //   return new CustomResponse().success({
  //     payload: { data: lawyer },
  //   });
  // }

  // @ApiBearerAuth()
  // @Get('user/private/profile/pre-signed-url')
  // @UseGuards(UserJwtDecodeGuard)
  // @UseGuards(UserSuspendedGuard)
  // async getUploadPreSignedUrl(@Persona() userJWT: UserJwtPersona, @Query() query: GetImagePreSignedUrlQueryDto) {
  //   const data = await this.userProfilesService.generatePresignedUrl(userJWT._id, query);

  //   return new CustomResponse().success({
  //     payload: { data },
  //   });
  // }
}
