import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReadingEventDto } from './dto/create-reading-event.dto';
import { ReadingEvent } from './schemas/reading-event.schema';

@Injectable()
export class ReadingEventsService {
  constructor(
    @InjectModel(ReadingEvent.name)
    private readonly readingEventModel: Model<ReadingEvent>,
  ) {}

  create(createReadingEventDto: CreateReadingEventDto) {
    return this.readingEventModel.create(createReadingEventDto);
  }

  findAll() {
    return this.readingEventModel.find().sort({ occurredAt: -1 }).exec();
  }
}
