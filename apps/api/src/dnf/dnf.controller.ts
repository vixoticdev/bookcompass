import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DnfService } from './dnf.service';
import { CreateDnfRecordDto } from './dto/create-dnf-record.dto';

@Controller('dnf-records')
export class DnfController {
  constructor(private readonly dnfService: DnfService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createDnfRecordDto: CreateDnfRecordDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.dnfService.create({
      ...createDnfRecordDto,
      userId: user.id,
    });
  }

  @Get()
  findAll() {
    return this.dnfService.findAll();
  }
}
