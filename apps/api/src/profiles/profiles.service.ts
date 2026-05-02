import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReadingProfileDto } from './dto/create-reading-profile.dto';
import { ReadingProfile } from './schemas/reading-profile.schema';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(ReadingProfile.name)
    private readonly readingProfileModel: Model<ReadingProfile>,
  ) {}

  create(createReadingProfileDto: CreateReadingProfileDto) {
    return this.readingProfileModel.create(createReadingProfileDto);
  }

  findAll() {
    return this.readingProfileModel.find().sort({ updatedAt: -1 }).exec();
  }
}
