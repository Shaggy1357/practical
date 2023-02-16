import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throwError } from 'rxjs';
import { ILike, Repository } from 'typeorm';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { School } from './entities/school.entity';
import * as fs from 'fs';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(School) private schoolRepo: Repository<School>,
    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}

  async create(createSchoolDto: CreateSchoolDto, file) {
    const existingSchool = await this.schoolRepo.findOne({
      where: { name: createSchoolDto.name },
    });
    if (existingSchool) {
      throw new BadRequestException('School already exist!');
    }

    const newSchool = this.schoolRepo.create(createSchoolDto);
    if (file) {
      newSchool.photo = file.filename;
    }
    var password = Math.random().toString(36).slice(-8);
    this.mailerService
      .sendMail({
        to: newSchool.email,
        from: 'pawan.bansari@creolestudios.com',
        subject: 'Registration Successfull!',
        text: `Thanks for registring with us! Your password is ${password}. Keep it safe!`,
      })
      .catch((mailerror) => {
        console.log('Mail Error', mailerror);
      });
    newSchool.password = password;
    await this.schoolRepo.save(newSchool);
    const payload = {
      schoolId: newSchool.id,
      schoolEmail: newSchool.email,
    };
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET,
    });
    return { access_token, newSchool };
  }

  async login(schoolLogin) {
    const existingUser = await this.schoolRepo.findOne({
      where: { email: schoolLogin.email },
    });
    if (!existingUser) {
      throw new BadRequestException('School does not exist!');
    }
    const payload = {
      schoolId: existingUser.id,
      schoolEmail: existingUser.email,
    };
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET,
    });
    return { access_token, existingUser };
  }

  async findAll(query) {
    const take = query.take || 10;
    const skip = query.skip || 0;
    const keyword = query.keyword || '';
    const [result, total] = await this.schoolRepo.findAndCount({
      where: { city: ILike('%' + keyword + '%') },
      order: { name: 'DESC' },
      take: take,
      skip: skip,
    });
    return { data: result, count: total };
  }

  async findOne(id: number) {
    const existingSchool = await this.schoolRepo.findOne({
      where: {
        id: id,
      },
    });
    if (!existingSchool) {
      throw new BadRequestException('Shool not found!');
    }
    return existingSchool;
  }

  async update(id: number, updateSchoolDto: UpdateSchoolDto, photo) {
    const existingSchool = await this.schoolRepo.findOne({ where: { id: id } });

    if (!existingSchool) {
      throw new BadRequestException('School does not exist!');
    }

    const updatedDetails = Object.assign(existingSchool, updateSchoolDto);
    if (photo) {
      fs.unlink(`${photo.destination}/${existingSchool.photo}`, (err) => {
        if (err) {
          console.log(err);
          return err;
        }
      });
      if (photo) {
        updatedDetails.photo = photo.filename;
      }

      return await this.schoolRepo.save(updatedDetails);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} school`;
  }
}
