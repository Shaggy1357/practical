import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLogin {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
