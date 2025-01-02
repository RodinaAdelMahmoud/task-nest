import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AWS_S3_CLIENT, AWS_S3_MODULE_OPTIONS } from '@common/modules/aws-s3/constants';
import { AwsS3ModuleOptions } from '@common/modules/aws-s3/interfaces';
import { AppConfig } from '@common/modules/env-config/services/app-config';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AwsS3Service {
  constructor(
    @Inject(AWS_S3_CLIENT) private s3Client: S3Client,
    @Inject(AWS_S3_MODULE_OPTIONS) private options: AwsS3ModuleOptions,
    private appConfig: AppConfig,
  ) {}

  async generatePresignedUrl(key: string): Promise<string> {
    const command = new PutObjectCommand({ Bucket: this.appConfig.AWS_UPLOAD_BUCKET_NAME, Key: key });
    return getSignedUrl(this.s3Client, command, { expiresIn: 30 * 60 }); // 30 minutes
  }
}
