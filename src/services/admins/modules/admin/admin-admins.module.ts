import { Module } from '@nestjs/common';
import {
  AdminManagementController,
  AdminManagementService,
  AdminProfileController,
  AdminProfileService,
  AdminRolesController,
  AdminRolesService,
} from './controllers';
import { AdminMongooseModule, AdminRolesMongooseModule } from '@common';

@Module({
  imports: [AdminMongooseModule, AdminRolesMongooseModule],
  controllers: [AdminManagementController, AdminProfileController, AdminRolesController],
  providers: [AdminManagementService, AdminProfileService, AdminRolesService],
})
export class AdminAdminsModule {}
