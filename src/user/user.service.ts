import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
require('dotenv').config();

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto, file: Express.Multer.File) {
    const existingUser = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exist!');
    }
    var password = Math.random().toString(36).slice(-8);

    const newUser = await this.userRepo.create({
      email: createUserDto.email,
      password: password,
    });
    createUserDto.role
      ? (newUser.role = createUserDto.role)
      : (newUser.role = undefined);

    this.mailerService
      .sendMail({
        to: newUser.email,
        from: 'pawan.bansari@creolestudios.com',
        subject: 'Registration Successfull!',
        text: `Thanks for registring with us! Your password is ${password}. Keep it safe!`,
      })
      .catch((mailerror) => {
        console.log('Mail Error', mailerror);
      });

    await this.userRepo.save(newUser);
    const payload = {
      userId: newUser.id,
      userEmail: newUser.email,
      userRole: newUser.role,
    };
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET,
    });
    return { access_token, newUser };
  }

  async findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async login(userLogin) {
    const existingUser = await this.userRepo.findOne({
      where: { email: userLogin.email },
    });
    if (!existingUser) {
      throw new BadRequestException('User does not exist!');
    }
    const payload = {
      userId: existingUser.id,
      userEmail: existingUser.email,
      userRole: existingUser.role,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET,
    });

    return { access_token, existingUser };
  }
}
