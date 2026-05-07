import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CatalogPage,
  escapeRegex,
  normalizeCatalogPagination,
} from '../catalog/catalog-query';
import { CreateBookDto } from './dto/create-book.dto';
import { ListBooksQueryDto } from './dto/list-books-query.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './schemas/book.schema';

export function buildBookFilters(query: ListBooksQueryDto) {
  const filters: Record<string, unknown> = {};

  if (query.q) {
    filters.title = { $regex: escapeRegex(query.q), $options: 'i' };
  }

  if (query.authorId) {
    filters.authorId = query.authorId;
  }

  if (query.genre) {
    filters.genres = query.genre;
  }

  if (query.outcome) {
    filters.outcomeTags = query.outcome;
  }

  if (query.pacing) {
    filters.pacing = query.pacing;
  }

  if (query.difficulty) {
    filters.difficulty = query.difficulty;
  }

  if (query.depth) {
    filters.depth = query.depth;
  }

  if (query.format) {
    filters.formats = query.format;
  }

  if (query.enrichmentStatus) {
    filters.enrichmentStatus = query.enrichmentStatus;
  }

  if (query.recommendationEligible !== undefined) {
    filters.recommendationEligible = query.recommendationEligible;
  }

  if (query.styleTag) {
    filters.styleTags = query.styleTag;
  }

  if (query.riskTag) {
    filters.riskTags = query.riskTag;
  }

  if (query.maxEstimatedMinutes) {
    filters.estimatedMinutes = { $lte: query.maxEstimatedMinutes };
  }

  return filters;
}

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
  ) {}

  create(createBookDto: CreateBookDto) {
    return this.bookModel.create(createBookDto);
  }

  async findById(bookId: string) {
    const book = await this.bookModel.findById(bookId).exec();

    if (!book) {
      throw new NotFoundException('Book not found.');
    }

    return book;
  }

  async findAll(query: ListBooksQueryDto = {}): Promise<CatalogPage<Book>> {
    const filters = buildBookFilters(query);
    const { limit, offset } = normalizeCatalogPagination(query);
    const [items, total] = await Promise.all([
      this.bookModel
        .find(filters)
        .sort({ title: 1 })
        .skip(offset)
        .limit(limit)
        .exec(),
      this.bookModel.countDocuments(filters).exec(),
    ]);

    return { items, total, limit, offset };
  }

  upsertByTitleAndAuthor(createBookDto: CreateBookDto) {
    return this.bookModel
      .findOneAndUpdate(
        { title: createBookDto.title, authorId: createBookDto.authorId },
        { $set: createBookDto },
        {
          returnDocument: 'after',
          runValidators: true,
          setDefaultsOnInsert: true,
          upsert: true,
        },
      )
      .exec();
  }

  async updateById(bookId: string, updateBookDto: UpdateBookDto) {
    const book = await this.bookModel
      .findByIdAndUpdate(
        bookId,
        { $set: updateBookDto },
        { new: true, runValidators: true },
      )
      .exec();

    if (!book) {
      throw new NotFoundException('Book not found.');
    }

    return book;
  }

  async deleteById(bookId: string) {
    const book = await this.bookModel.findByIdAndDelete(bookId).exec();

    if (!book) {
      throw new NotFoundException('Book not found.');
    }

    return book;
  }
}
