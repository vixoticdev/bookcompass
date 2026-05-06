import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateReadingProfileDto } from './dto/create-reading-profile.dto';
import { UpdateReadingProfileDto } from './dto/update-reading-profile.dto';
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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.profilesService.findByUserId(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(
    @Body() updateReadingProfileDto: UpdateReadingProfileDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.profilesService.updateByUserId(
      user.id,
      updateReadingProfileDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.profilesService.findAll();
  }
}
