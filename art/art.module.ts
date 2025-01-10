import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Art } from './entities/art.entity';
import { ArtService } from './art.service';
import { ArtController } from './art.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Art])],
  controllers: [ArtController],
  providers: [ArtService],
})
export class ArtModule {}