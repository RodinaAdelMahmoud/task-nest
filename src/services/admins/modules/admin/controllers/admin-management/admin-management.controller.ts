import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AdminJwtAuthGuard,
  AdminJwtPersona,
  AdminPermission,
  AdminResourceOperationsEnum,
  AdminResourcesEnum,
  BasePaginationQuery,
  CustomResponse,
  Persona,
} from '@common';
import { AdminIdParamDto } from '../../../../shared';
import { AdminManagementService } from './admin-management.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ListAllAdminsForList } from './dto/list-all-admins.dto';

@Controller({ path: 'private/management', version: VERSION_NEUTRAL })
@ApiTags('admins-management')
export class AdminManagementController {
  constructor(private readonly adminManagementService: AdminManagementService) {}

  @Patch('unsuspend/:adminId')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @AdminPermission({ resource: AdminResourcesEnum.ADMINS, operation: AdminResourceOperationsEnum.UPDATE })
  @ApiOperation({ summary: 'Unsuspend an admin account' })
  async unSuspendAdmin(@Persona() adminJWT: AdminJwtPersona, @Param() param: AdminIdParamDto) {
    await this.adminManagementService.unSuspendAdmin(adminJWT._id, param);

    return new CustomResponse().success({});
  }

  @Patch('suspend/:adminId')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @AdminPermission({ resource: AdminResourcesEnum.ADMINS, operation: AdminResourceOperationsEnum.UPDATE })
  @ApiOperation({ summary: 'Suspend an admin account' })
  async suspendAdmin(@Persona() adminJWT: AdminJwtPersona, @Param() param: AdminIdParamDto) {
    await this.adminManagementService.suspendAdmin(adminJWT._id, param);

    return new CustomResponse().success({});
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @AdminPermission({ resource: AdminResourcesEnum.ADMINS, operation: AdminResourceOperationsEnum.CREATE })
  @ApiOperation({ summary: 'Create a new Admin' })
  async createAdmin(@Persona() adminJWT: AdminJwtPersona, @Body() body: CreateAdminDto) {
    const newAdmin = await this.adminManagementService.createAdmin(body);

    return new CustomResponse().success({
      payload: { data: newAdmin },
    });
  }

  @Patch(':adminId')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @AdminPermission({ resource: AdminResourcesEnum.ADMINS, operation: AdminResourceOperationsEnum.UPDATE })
  @ApiOperation({ summary: 'Update details of an existing admin' })
  async updateAdmin(
    @Persona() adminJWT: AdminJwtPersona,
    @Param() param: AdminIdParamDto,
    @Body() body: UpdateAdminDto,
  ) {
    const updatedAdmin = await this.adminManagementService.updateAdmin(param, body);

    return new CustomResponse().success({
      payload: { data: updatedAdmin },
    });
  }

  @Delete(':adminId')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @AdminPermission({ resource: AdminResourcesEnum.ADMINS, operation: AdminResourceOperationsEnum.DELETE })
  @ApiOperation({ summary: 'Delete account of an admin' })
  async deleteAdmin(@Persona() adminJWT: AdminJwtPersona, @Param() params: AdminIdParamDto) {
    const newAdmin = await this.adminManagementService.deleteAdmin(adminJWT._id, params);

    return new CustomResponse().success({
      payload: { data: newAdmin },
    });
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @AdminPermission({ resource: AdminResourcesEnum.ADMINS, operation: AdminResourceOperationsEnum.READ })
  @ApiOperation({ summary: 'Get a paginated list of all admins' })
  async getAdmins(@Persona() adminJWT: AdminJwtPersona, @Query() query: BasePaginationQuery) {
    console.log(adminJWT._id);

    const admins = await this.adminManagementService.getAdmins(adminJWT._id, query);
    return new CustomResponse().success({
      payload: admins,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Get All Admins List' })
  @Get('list')
  @AdminPermission({ resource: AdminResourcesEnum.ADMINS, operation: AdminResourceOperationsEnum.FILTER })
  async getAdminsList(@Query() query: ListAllAdminsForList) {
    const admins = await this.adminManagementService.getAdminIdList(query);
    return new CustomResponse().success({
      payload: { data: admins },
    });
  }

  @Get(':adminId')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @AdminPermission({ resource: AdminResourcesEnum.ADMINS, operation: AdminResourceOperationsEnum.READ })
  @ApiOperation({ summary: 'Get details of an existing admin' })
  async getAdminById(@Persona() adminJWT: AdminJwtPersona, @Param() param: AdminIdParamDto) {
    const city = await this.adminManagementService.getAdminById(adminJWT._id, param);
    return new CustomResponse().success({
      payload: {
        data: city,
      },
    });
  }
}
