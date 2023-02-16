import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { School } from 'src/school/entities/school.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
require('dotenv').config();

export class SchoolStrategy extends PassportStrategy(Strategy, 'school') {
  constructor(
    @InjectRepository(School) private schoolRepo: Repository<School>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any, req: Request) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    const user = await this.schoolRepo.findOne({
      where: { email: payload.email },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    req.user = user;
    return req.user;
  }
}
