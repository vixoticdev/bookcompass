import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { ListAuthorsQueryDto } from './dto/list-authors-query.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(createAuthorDto);
  }

  @Get()
  findAll(@Query() query: ListAuthorsQueryDto) {
    return this.authorsService.findAll(query);
  }
}
