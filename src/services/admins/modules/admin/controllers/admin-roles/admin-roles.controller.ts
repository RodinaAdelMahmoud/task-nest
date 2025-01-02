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
import { RoleIdParamDto } from '../../../../shared';
import { AdminRolesService } from './admin-roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleBodyDto } from './dto/update-role.dto';
import { ListAllRolesForList } from './dto/list-all-roles.dto';

@Controller({ path: 'private/roles', version: VERSION_NEUTRAL })
@ApiTags('admin-roles')
export class AdminRolesController {
  constructor(private readonly adminRolesService: AdminRolesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @AdminPermission({ resource: AdminResourcesEnum.ADMIN_ROLES, operation: AdminResourceOperationsEnum.CREATE })
  async createRole(@Persona() adminJWT: AdminJwtPersona, @Body() body: CreateRoleDto) {
    const newRole = await this.adminRolesService.createRole(adminJWT._id, body);

    return new CustomResponse().success({
      payload: { data: newRole },
    });
  }

  @Patch(':roleId')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @AdminPermission({ resource: AdminResourcesEnum.ADMIN_ROLES, operation: AdminResourceOperationsEnum.UPDATE })
  async updateRole(
    @Persona() adminJWT: AdminJwtPersona,
    @Param() param: RoleIdParamDto,
    @Body() body: UpdateRoleBodyDto,
  ) {
    const updatedRole = await this.adminRolesService.updateRole(adminJWT._id, param, body);

    return new CustomResponse().success({
      payload: { data: updatedRole },
    });
  }

  @Delete(':roleId')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @AdminPermission({ resource: AdminResourcesEnum.ADMIN_ROLES, operation: AdminResourceOperationsEnum.DELETE })
  async deleteRole(@Persona() adminJWT: AdminJwtPersona, @Param() param: RoleIdParamDto) {
    await this.adminRolesService.deleteRole(adminJWT._id, param);

    return new CustomResponse().success({});
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @AdminPermission({ resource: AdminResourcesEnum.ADMIN_ROLES, operation: AdminResourceOperationsEnum.READ })
  async getRoles(@Persona() adminJWT: AdminJwtPersona, @Query() query: BasePaginationQuery) {
    const roles = await this.adminRolesService.getRoles(adminJWT._id, query);

    return new CustomResponse().success({
      payload: roles,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Get roles list' })
  @Get('list')
  @AdminPermission({ resource: AdminResourcesEnum.ADMIN_ROLES, operation: AdminResourceOperationsEnum.FILTER })
  async getRolesList(@Query() query: ListAllRolesForList) {
    const roles = await this.adminRolesService.getRoleIdList(query);
    return new CustomResponse().success({
      payload: { data: roles },
    });
  }

  @Get(':roleId')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @AdminPermission({ resource: AdminResourcesEnum.ADMIN_ROLES, operation: AdminResourceOperationsEnum.READ })
  async getRoleById(@Persona() adminJWT: AdminJwtPersona, @Param() param: RoleIdParamDto) {
    const role = await this.adminRolesService.getRoleById(adminJWT._id, param);

    return new CustomResponse().success({
      payload: {
        data: role,
      },
    });
  }
}
