import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto & {
      passwordHash?: string;
      role?: 'reader' | 'admin';
    },
  ) {
    try {
      return await this.userModel.create(createUserDto);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000
      ) {
        throw new ConflictException('A user with this email already exists.');
      }

      throw error;
    }
  }

  findByEmail(email: string, options: { includePasswordHash?: boolean } = {}) {
    const query = this.userModel.findOne({ email: email.toLowerCase().trim() });

    if (options.includePasswordHash) {
      query.select('+passwordHash');
    }

    return query.exec();
  }

  findById(userId: string) {
    return this.userModel.findById(userId).exec();
  }

  findAll() {
    return this.userModel.find().sort({ createdAt: -1 }).exec();
  }

  upsertAdminByEmail(input: {
    displayName: string;
    email: string;
    passwordHash: string;
  }) {
    return this.userModel
      .findOneAndUpdate(
        { email: input.email.toLowerCase().trim() },
        {
          $set: {
            displayName: input.displayName,
            email: input.email,
            passwordHash: input.passwordHash,
            role: 'admin',
          },
        },
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
