import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateReadingProfileDto } from './dto/create-reading-profile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  create(@Body() createReadingProfileDto: CreateReadingProfileDto) {
    return this.profilesService.create(createReadingProfileDto);
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }
}
