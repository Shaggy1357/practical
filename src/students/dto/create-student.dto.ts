import { IsString, IsNotEmpty, IsDate, IsNumber } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  parentsName: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  std: string;

  @IsString()
  @IsNotEmpty()
  photo: string;

  @IsDate()
  @IsNotEmpty()
  dob: Date;

  @IsNumber()
  @IsNotEmpty()
  schoolId: number;

  @IsNumber()
  @IsNotEmpty()
  isActive: number;
}
