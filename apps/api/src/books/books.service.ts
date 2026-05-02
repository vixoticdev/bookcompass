import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from './schemas/book.schema';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
  ) {}

  create(createBookDto: CreateBookDto) {
    return this.bookModel.create(createBookDto);
  }

  findAll() {
    return this.bookModel.find().sort({ title: 1 }).exec();
  }
}
