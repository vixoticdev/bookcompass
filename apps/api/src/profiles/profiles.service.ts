import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReadingProfileDto } from './dto/create-reading-profile.dto';
import { UpdateReadingProfileDto } from './dto/update-reading-profile.dto';
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

  async findByUserId(userId: string) {
    const profile = await this.readingProfileModel.findOne({ userId }).exec();

    if (!profile) {
      throw new NotFoundException('Reading profile not found.');
    }

    return profile;
  }

  async updateByUserId(
    userId: string,
    updateReadingProfileDto: UpdateReadingProfileDto,
  ) {
    const profile = await this.readingProfileModel
      .findOneAndUpdate(
        { userId },
        { $set: updateReadingProfileDto },
        { new: true, runValidators: true },
      )
      .exec();

    if (!profile) {
      throw new NotFoundException('Reading profile not found.');
    }

    return profile;
  }

  findAll() {
    return this.readingProfileModel.find().sort({ updatedAt: -1 }).exec();
  }
}
