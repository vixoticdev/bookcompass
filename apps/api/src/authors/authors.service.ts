import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CatalogPage,
  escapeRegex,
  normalizeCatalogPagination,
} from '../catalog/catalog-query';
import { CreateAuthorDto } from './dto/create-author.dto';
import { ListAuthorsQueryDto } from './dto/list-authors-query.dto';
import { Author } from './schemas/author.schema';

export function buildAuthorFilters(query: ListAuthorsQueryDto) {
  const filters: Record<string, unknown> = {};

  if (query.q) {
    filters.name = { $regex: escapeRegex(query.q), $options: 'i' };
  }

  if (query.genre) {
    filters.knownForGenres = query.genre;
  }

  if (query.outcome) {
    filters.outcomeStrengths = query.outcome;
  }

  return filters;
}

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author.name) private readonly authorModel: Model<Author>,
  ) {}

  create(createAuthorDto: CreateAuthorDto) {
    return this.authorModel.create(createAuthorDto);
  }

  async findAll(query: ListAuthorsQueryDto = {}): Promise<CatalogPage<Author>> {
    const filters = buildAuthorFilters(query);
    const { limit, offset } = normalizeCatalogPagination(query);
    const [items, total] = await Promise.all([
      this.authorModel
        .find(filters)
        .sort({ name: 1 })
        .skip(offset)
        .limit(limit)
        .exec(),
      this.authorModel.countDocuments(filters).exec(),
    ]);

    return { items, total, limit, offset };
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
