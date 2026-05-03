import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthorDto } from './dto/create-author.dto';
import { ListAuthorsQueryDto } from './dto/list-authors-query.dto';
import { Author } from './schemas/author.schema';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author.name) private readonly authorModel: Model<Author>,
  ) {}

  create(createAuthorDto: CreateAuthorDto) {
    return this.authorModel.create(createAuthorDto);
  }

  findAll(query: ListAuthorsQueryDto = {}) {
    const filters: Record<string, unknown> = {};

    if (query.q) {
      filters.name = { $regex: query.q, $options: 'i' };
    }

    if (query.genre) {
      filters.knownForGenres = query.genre;
    }

    if (query.outcome) {
      filters.outcomeStrengths = query.outcome;
    }

    return this.authorModel.find(filters).sort({ name: 1 }).exec();
  }

  upsertByName(createAuthorDto: CreateAuthorDto) {
    return this.authorModel
      .findOneAndUpdate(
        { name: createAuthorDto.name },
        { $set: createAuthorDto },
        {
          returnDocument: 'after',
          runValidators: true,
          setDefaultsOnInsert: true,
          upsert: true,
        },
      )
      .exec();
  }
}
