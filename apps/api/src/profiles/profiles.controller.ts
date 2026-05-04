import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReadingProfileDto } from './dto/create-reading-profile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createReadingProfileDto: CreateReadingProfileDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.profilesService.create({
      ...createReadingProfileDto,
      userId: user.id,
    });
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }
}
