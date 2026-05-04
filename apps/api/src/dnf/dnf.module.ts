import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { DnfController } from './dnf.controller';
import { DnfService } from './dnf.service';
import { DnfRecord, DnfRecordSchema } from './schemas/dnf-record.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: DnfRecord.name, schema: DnfRecordSchema },
    ]),
  ],
  controllers: [DnfController],
  providers: [DnfService],
  exports: [DnfService],
})
export class DnfModule {}
