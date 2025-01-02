import { Body, Controller, Get, Patch, Query, UseGuards, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminJwtAuthGuard, AdminJwtPersona, CustomResponse, GetImagePreSignedUrlQueryDto, Persona } from '@common';
import { AdminProfileService } from './admin-profile.service';
import { EditProfileDto } from './dto';

@Controller({ path: 'private/profile', version: VERSION_NEUTRAL })
@ApiTags('admin-profile')
export class AdminProfileController {
  constructor(private readonly adminProfileService: AdminProfileService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  async getAdminProfile(@Persona() adminJWT: AdminJwtPersona) {
    const admin = await this.adminProfileService.getAdminProfile(adminJWT._id);

    return new CustomResponse().success({
      payload: { data: admin },
    });
  }

  @Patch()
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  async editAdminProfile(@Persona() adminJWT: AdminJwtPersona, @Body() body: EditProfileDto) {
    const admin = await this.adminProfileService.editAdminProfile(adminJWT._id, body);

    return new CustomResponse().success({
      payload: { data: admin },
    });
  }

  @Get('pre-signed-url')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  async getUploadPreSignedUrl(@Persona() adminJWT: AdminJwtPersona, @Query() query: GetImagePreSignedUrlQueryDto) {
    const data = await this.adminProfileService.generatePresignedUrl(adminJWT._id, query);

    return new CustomResponse().success({
      payload: { data },
    });
  }
}
