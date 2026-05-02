import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import {
  ReadingProfile,
  ReadingProfileSchema,
} from './schemas/reading-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReadingProfile.name, schema: ReadingProfileSchema },
    ]),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
