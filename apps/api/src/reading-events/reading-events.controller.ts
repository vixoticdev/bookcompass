import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateReadingEventDto } from './dto/create-reading-event.dto';
import { ReadingEventsService } from './reading-events.service';

@Controller('reading-events')
export class ReadingEventsController {
  constructor(private readonly readingEventsService: ReadingEventsService) {}

  @Post()
  create(@Body() createReadingEventDto: CreateReadingEventDto) {
    return this.readingEventsService.create(createReadingEventDto);
  }

  @Get()
  findAll() {
    return this.readingEventsService.findAll();
  }
}
