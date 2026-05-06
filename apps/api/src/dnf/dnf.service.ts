import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDnfRecordDto } from './dto/create-dnf-record.dto';
import { DnfRecord } from './schemas/dnf-record.schema';

@Injectable()
export class DnfService {
  constructor(
    @InjectModel(DnfRecord.name)
    private readonly dnfRecordModel: Model<DnfRecord>,
  ) {}

  create(createDnfRecordDto: CreateDnfRecordDto) {
    return this.dnfRecordModel.create(createDnfRecordDto);
  }

  findAll() {
    return this.dnfRecordModel.find().sort({ createdAt: -1 }).exec();
  }

  findByUserId(userId: string) {
    return this.dnfRecordModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }
}
