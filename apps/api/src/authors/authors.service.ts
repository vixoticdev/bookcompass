import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthorDto } from './dto/create-author.dto';
import { Author } from './schemas/author.schema';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author.name) private readonly authorModel: Model<Author>,
  ) {}

  create(createAuthorDto: CreateAuthorDto) {
    return this.authorModel.create(createAuthorDto);
  }

  findAll() {
    return this.authorModel.find().sort({ name: 1 }).exec();
  }
}
