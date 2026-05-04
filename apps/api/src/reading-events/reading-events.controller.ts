import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReadingEventDto } from './dto/create-reading-event.dto';
import { ReadingEventsService } from './reading-events.service';

@Controller('reading-events')
export class ReadingEventsController {
  constructor(private readonly readingEventsService: ReadingEventsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createReadingEventDto: CreateReadingEventDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.readingEventsService.create({
      ...createReadingEventDto,
      userId: user.id,
    });
  }

  @Get()
  findAll() {
    return this.readingEventsService.findAll();
  }
}
