import { Body, Controller, Get, Post } from '@nestjs/common';
import { DnfService } from './dnf.service';
import { CreateDnfRecordDto } from './dto/create-dnf-record.dto';

@Controller('dnf-records')
export class DnfController {
  constructor(private readonly dnfService: DnfService) {}

  @Post()
  create(@Body() createDnfRecordDto: CreateDnfRecordDto) {
    return this.dnfService.create(createDnfRecordDto);
  }

  @Get()
  findAll() {
    return this.dnfService.findAll();
  }
}
