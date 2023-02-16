import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { School } from 'src/school/entities/school.entity';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import * as fs from 'fs';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(School) private schoolRepo: Repository<School>,
  ) {}
  async create(createStudentDto: CreateStudentDto, file) {
    const newStudent = this.studentRepo.create(createStudentDto);
    if (file) {
      newStudent.photo = file.filename;
    }
    newStudent.schoolId = createStudentDto.schoolId;

    await this.studentRepo.save(newStudent);
    return newStudent;
  }

  async findAll(query) {
    const take = query.take || 10;
    const skip = query.skip || 0;
    const school = query.city || '';
    const std = query.std || '';
    const isActive = query.isActive || '';

    const schoolName = await this.schoolRepo.findOne({
      where: { name: school },
    });
    const schoolId = schoolName?.id;
    let students = await this.studentRepo
      .createQueryBuilder()
      .take(take)
      .skip(skip)
      .orderBy({ id: 'DESC' });
    if (school || std || isActive) {
      students = students.where(
        `student.schoolId like '%${schoolId}%' or student.std like '%${std}%' or student.isActive like '%${isActive}%'`,
      );
    }

    const getAllStudents = await students.getManyAndCount();
    return { data: getAllStudents[0], count: getAllStudents[1] };
  }

  async findOne(id: number) {
    const existingStudent = await this.studentRepo.findOne({
      where: { id: id },
    });
    if (!existingStudent) {
      throw new BadRequestException('Student not found!');
    }
    return existingStudent;
  }

  async update(id: number, updateStudentDto: UpdateStudentDto, file) {
    const existingStudent = await this.studentRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!existingStudent) {
      throw new BadRequestException('Student not found!');
    }
    const updatedDetails = Object.assign(existingStudent, updateStudentDto);

    if (file) {
      fs.unlink(`${file.destination}/${existingStudent.photo}`, (err) => {
        if (err) {
          console.log(err);
          return err;
        }
      });
      if (file) {
        updatedDetails.photo = file.filename;
      }
    }
    return await this.studentRepo.save(updatedDetails);
  }

  async remove(id: number) {
    const existingStudent = await this.studentRepo.findOne({
      where: { id: id },
    });
    if (!existingStudent) {
      throw new BadRequestException('Student not found!');
    }
    return await this.studentRepo.delete(existingStudent);
  }

  async getCount() {
    const count = await this.studentRepo.createQueryBuilder().getCount();
    return count;
  }

  async getCountByStd(std) {
    const count = await this.studentRepo
      .createQueryBuilder()
      .where(`student.std like '%${std.std}%'`)
      .getCount();
    return count;
  }

  async getCountBySchool(school) {
    const schools = await this.schoolRepo.findOne({
      where: { name: school.name },
    });
    // const id = schools.id;

    const count = await this.studentRepo
      .createQueryBuilder()
      .where(`student.schoolId like '%${schools.id}%'`)
      .getCount();
    return count;
  }
}
