import { ConflictException, Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateAdminDto, UpdateAdminDto } from './dto';
import { ModelNames, IAdminModel, IAdminRoleModel, AdminStatusEnum, BasePaginationQuery } from '@common';
import { AdminIdParamDto, errorManager } from '../../../../shared';
import Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { escapeRegExp } from 'lodash';
import { ListAllAdminsForList } from './dto/list-all-admins.dto';

@Injectable()
export class AdminManagementService {
  private readonly redis: Redis;

  constructor(
    @Inject(ModelNames.ADMIN) private adminModel: IAdminModel,
    @Inject(ModelNames.ADMIN_ROLE) private adminRoleModel: IAdminRoleModel,
    private readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getClient();
  }

  async unSuspendAdmin(adminId: string, { adminId: viewedAdminId }: AdminIdParamDto) {
    if (adminId === viewedAdminId) {
      throw new ConflictException(errorManager.ADMIN_UNSUSPEND_SELF);
    }

    const admin = await this.adminModel.findById(viewedAdminId);
    if (!admin) {
      throw new NotFoundException(errorManager.ADMIN_NOT_FOUND);
    }

    if (admin.status !== AdminStatusEnum.SUSPENDED) {
      throw new UnprocessableEntityException(errorManager.ADMIN_NOT_SUSPENDED);
    }

    // todo: add this to unsuspendDoc
    admin.status = AdminStatusEnum.ACTIVE;
    await this.removeAdminSession(viewedAdminId);
    await admin.save();
  }

  async suspendAdmin(adminId: string, { adminId: viewedAdminId }: AdminIdParamDto) {
    if (adminId === viewedAdminId) {
      throw new ConflictException(errorManager.ADMIN_SUSPEND_SELF);
    }

    const admin = await this.adminModel.findById(viewedAdminId);
    if (!admin) {
      throw new NotFoundException(errorManager.ADMIN_NOT_FOUND);
    }

    if (admin.status !== AdminStatusEnum.ACTIVE) {
      throw new UnprocessableEntityException(errorManager.ADMIN_NOT_ACTIVE);
    }

    //todo: add this to suspendDoc
    admin.status = AdminStatusEnum.SUSPENDED;
    await this.removeAdminSession(viewedAdminId);
    await admin.save();
  }

  async createAdmin({ email, name, password, roleId }: CreateAdminDto) {
    if (await this.adminModel.exists({ email: email.toLowerCase() })) {
      throw new ConflictException(errorManager.ADMIN_EMAIL_EXISTS);
    }

    const adminRole = await this.adminRoleModel.findById(roleId, { _id: 1, name: 1, permissions: 1 });
    if (!adminRole) {
      throw new NotFoundException(errorManager.ADMIN_ROLE_NOT_FOUND);
    }

    const newAdmin = new this.adminModel({
      email,
      name,
      // phone,
      password,
      role: adminRole,
    });

    const savedAdmin = await newAdmin.save();

    return savedAdmin;
  }

  async updateAdmin({ adminId }: AdminIdParamDto, body: UpdateAdminDto) {
    const { email, roleId } = body;

    const admin = await this.adminModel.findById(adminId);
    if (!admin) {
      throw new NotFoundException(errorManager.ADMIN_NOT_FOUND);
    }

    if (
      email &&
      admin.email !== email.toLowerCase() &&
      (await this.adminModel.exists({ email: email.toLowerCase() }))
    ) {
      throw new ConflictException(errorManager.ADMIN_EMAIL_EXISTS);
    }

    const adminRole = roleId
      ? await this.adminRoleModel.findById(roleId, { _id: 1, name: 1, permissions: 1 })
      : undefined;

    if (roleId && !adminRole) {
      throw new NotFoundException(errorManager.ADMIN_ROLE_NOT_FOUND);
    }

    admin.set({ ...body, ...(roleId && { role: adminRole }) });

    const newAdmin = await admin.save();

    return newAdmin;
  }

  async deleteAdmin(adminId: string, { adminId: viewedAdminId }: AdminIdParamDto) {
    if (adminId === viewedAdminId) {
      throw new ConflictException(errorManager.ADMIN_DELETE_SELF);
    }

    const admin = await this.adminModel.findById(viewedAdminId);
    if (!admin) {
      throw new NotFoundException(errorManager.ADMIN_NOT_FOUND);
    }

    await this.removeAdminSession(viewedAdminId);

    await this.adminModel.deleteOne({ _id: viewedAdminId }).exec();

    // // Recalculate the total count of documents
    // const totalDocuments = await this.adminModel.countDocuments({ status: AdminStatusEnum.ACTIVE }).exec();

    // // Update the totalCount field in all documents
    // await this.adminModel.updateMany({}, { totalCount: totalDocuments }).exec();

    // await admin.deleteDoc();
    return admin;
  }

  async getAdmins(adminId: string, { page, limit }: BasePaginationQuery) {
    const matchStage = {};
    const [total, docs] = await Promise.all([
      this.adminModel.find(matchStage).countDocuments(),
      this.adminModel
        .find(matchStage, { _id: 1, name: 1, email: 1, profilePictureUrl: 1, role: 1, status: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    return { data: docs, total, limit, page, pages: Math.ceil(total / limit) };
  }

  async getAdminById(adminId: string, { adminId: viewedAdminId }: AdminIdParamDto) {
    const admin = await this.adminModel
      .findById(viewedAdminId, {
        _id: 1,
        name: 1,
        // phone: 1,
        email: 1,
        profilePictureUrl: 1,
        permissions: 1,
        role: 1,
        status: 1,
      })
      .lean();

    if (!admin) {
      throw new NotFoundException(errorManager.ADMIN_NOT_FOUND);
    }

    return admin;
  }

  private async removeAdminSession(adminId: string) {
    await this.redis.del(adminId);
  }

  async getAdminIdList(query: ListAllAdminsForList) {
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

    const admins = await this.adminModel.find(filter).select('name email role').lean();
    return admins;
  }
}
