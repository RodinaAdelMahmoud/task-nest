import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AdminRole, BasePaginationQuery, IAdminModel, IAdminRoleModel, ModelNames, ResponsePayload } from '@common';
import { errorManager, RoleIdParamDto } from '../../../../shared';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleBodyDto } from './dto/update-role.dto';
import { ListAllRolesForList } from './dto/list-all-roles.dto';
import { escapeRegExp } from 'lodash';

@Injectable()
export class AdminRolesService {
  constructor(
    @Inject(ModelNames.ADMIN) private adminModel: IAdminModel,
    @Inject(ModelNames.ADMIN_ROLE) private adminRoleModel: IAdminRoleModel,
  ) {}

  async createRole(adminId: string, body: CreateRoleDto) {
    if (await this.adminRoleModel.exists({ name: body.name })) {
      throw new ConflictException(errorManager.ROLE_ALREADY_EXISTS);
    }

    const newRole = new this.adminRoleModel({
      ...body,
    });

    const savedRole = await newRole.save();

    const role = await this.adminRoleModel.findById(savedRole._id, {
      _id: 1,
      name: 1,
    });

    return role;
  }

  async updateRole(adminId: string, { roleId }: RoleIdParamDto, body: UpdateRoleBodyDto) {
    const oldRole = await this.adminRoleModel.findById(roleId);
    if (!oldRole) {
      throw new NotFoundException(errorManager.ROLE_NOT_FOUND);
    }

    // if (body.name && (await this.adminRoleModel.exists({ name: body.name }))) {
    //   throw new ConflictException(errorManager.ROLE_ALREADY_EXISTS);
    // }

    oldRole.set({
      ...body,
    });

    const savedRole = await oldRole.save();

    const updatedRole = await this.adminRoleModel.findById(savedRole._id, {
      _id: 1,
      name: 1,
      permissions: 1,
    });

    return updatedRole;
  }

  async deleteRole(adminId: string, { roleId }: RoleIdParamDto) {
    const role = await this.adminRoleModel.findById(roleId);
    if (!role) {
      throw new NotFoundException(errorManager.ROLE_NOT_FOUND);
    }

    if (await this.adminModel.exists({ 'role._id': roleId })) {
      throw new ConflictException(errorManager.ROLE_IN_USE);
    }

    await this.adminRoleModel.deleteOne({ _id: roleId }).exec();

    // await role.deleteDoc();
  }

  async getRoles(adminId: string, { page, limit }: BasePaginationQuery): Promise<ResponsePayload<AdminRole>> {
    const [total, docs] = await Promise.all([
      this.adminRoleModel.find({}).countDocuments(),
      this.adminRoleModel
        .find({}, { _id: 1, name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    return { data: docs, total, limit, page, pages: Math.ceil(total / limit) };
  }

  async getRoleById(adminId: string, { roleId }: RoleIdParamDto) {
    const role = await this.adminRoleModel
      .findById(roleId, {
        _id: 1,
        name: 1,
        permissions: 1,
      })
      .lean();
    if (!role) {
      throw new NotFoundException(errorManager.ROLE_NOT_FOUND);
    }

    return role;
  }

  async getRoleIdList(query: ListAllRolesForList) {
    const { search } = query;

    let filter: any = {
      // isPublished: true, // Add condition to retrieve only published products
      // isInStock: true, // Add condition to retrieve only products in stock
    };

    if (search) {
      const regex = new RegExp(escapeRegExp(search), 'i'); // Case-insensitive regex

      // Match job titles by name in English or Arabic
      filter.$or = [{ 'name.en': { $regex: regex } }, { 'name.ar': { $regex: regex } }];
    }

    const roles = await this.adminRoleModel.find(filter).select('_id name').lean();

    return roles;
  }
}
