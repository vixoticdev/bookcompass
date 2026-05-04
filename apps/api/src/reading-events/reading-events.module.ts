import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ReadingEventsController } from './reading-events.controller';
import { ReadingEventsService } from './reading-events.service';
import {
  ReadingEvent,
  ReadingEventSchema,
} from './schemas/reading-event.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: ReadingEvent.name, schema: ReadingEventSchema },
    ]),
  ],
  controllers: [ReadingEventsController],
  providers: [ReadingEventsService],
  exports: [ReadingEventsService],
})
export class ReadingEventsModule {}
