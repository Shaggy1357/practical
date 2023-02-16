import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { School } from 'src/school/entities/school.entity';
import { SchoolStrategy } from 'src/strategies/school.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, School]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [StudentsController],
  providers: [StudentsService, SchoolStrategy],
})
export class StudentsModule {}
