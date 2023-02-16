import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SchoolLogin {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
