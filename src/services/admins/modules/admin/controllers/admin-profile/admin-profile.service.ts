import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Admin, AppConfig, AwsS3Service, GetImagePreSignedUrlQueryDto, IAdminModel, ModelNames } from '@common';
import { EditProfileDto } from './dto';
import { Types } from 'mongoose';
import { errorManager } from '../../../../shared';

@Injectable()
export class AdminProfileService {
  constructor(
    @Inject(ModelNames.ADMIN) private adminModel: IAdminModel,
    private s3Service: AwsS3Service,
    private appConfig: AppConfig,
  ) {}

  async getAdminProfile(adminId: string) {
    const admin: Admin & {
      _id: Types.ObjectId;
    } = await this.adminModel
      .findById(adminId)
      .select({
        name: 1,
        // phone: 1,
        email: 1,
        profilePictureUrl: 1,
        role: 1,
        isDirector: 1,
        isViceManager: 1,
        isTopLevelManager: 1,
      })
      .populate({ path: 'role', select: { _id: 1, name: 1 } })
      .lean();

    return admin;
  }

  async editAdminProfile(adminId: string, body: EditProfileDto) {
    const admin = await this.adminModel.findById(adminId);

    if (!admin) {
      throw new NotFoundException(errorManager.ADMIN_NOT_FOUND);
    }

    admin.set(body);

    await admin.save();

    const updatedAdmin = await this.adminModel
      .findById(adminId)
      .select({ name: 1, email: 1, profilePictureUrl: 1, role: 1 })
      .populate({ path: 'role', select: { _id: 1, name: 1 } })
      .lean();

    return updatedAdmin;
  }

  async generatePresignedUrl(adminId: string, { filename }: GetImagePreSignedUrlQueryDto) {
    const fileExtension = filename.split('.').pop();

    if (!fileExtension) {
      throw new BadRequestException(errorManager.FILE_EXTENSION_REQUIRED);
    }

    const revisedFilename = `admin-profile-${adminId}-${Date.now()}.${fileExtension}`;
    const filePath = `${adminId}/profile/${revisedFilename}`;
    const preSignedUrl = await this.s3Service.generatePresignedUrl(filePath);
    const cloudFrontUrl = `${this.appConfig.MEDIA_DOMAIN}/${filePath}`;

    return {
      preSignedUrl, // CLient-side uploads on this url
      cloudFrontUrl, // Client-side will return this url
    };
  }
}
