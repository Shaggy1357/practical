import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from './entities/school.entity';
import { Student } from 'src/students/entities/student.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { SchoolStrategy } from 'src/strategies/school.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([School, Student]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWt_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [SchoolController],
  providers: [SchoolService, SchoolStrategy],
})
export class SchoolModule {}
