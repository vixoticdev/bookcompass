import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import {
  ReadingProfile,
  ReadingProfileSchema,
} from './schemas/reading-profile.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: ReadingProfile.name, schema: ReadingProfileSchema },
    ]),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
