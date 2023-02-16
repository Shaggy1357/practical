import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
export const Storage = {
  storage: diskStorage({
    destination: './upload/profileImages',
    filename: (req, file, cb) => {
      const filename: string = file.originalname;
      const fileName: string = filename.replace(/\s/g, '');
      const extention: string[] = fileName.split('.');
      cb(null, `${extention[0]}${new Date().getTime()}.${extention[1]}`);
    },
  }),
};

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @UseGuards(AuthGuard('school'))
  @Post('/createStudent')
  @UseInterceptors(FileInterceptor('photo', Storage))
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @UploadedFile()
    photo: Express.Multer.File,
  ) {
    return this.studentsService.create(createStudentDto, photo);
  }

  @UseGuards(AuthGuard('school'))
  @Get('findAll')
  async findAll(@Query() query) {
    return this.studentsService.findAll(query);
  }

  @UseGuards(AuthGuard('school'))
  @Get('/findById/:id')
  async findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  @UseGuards(AuthGuard('school'))
  @Patch('/update/:id')
  @UseInterceptors(FileInterceptor('photo', Storage))
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
    @UploadedFile()
    photo: Express.Multer.File,
  ) {
    return this.studentsService.update(+id, updateStudentDto, photo);
  }

  @UseGuards(AuthGuard('school'))
  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }

  @UseGuards(AuthGuard('school'))
  @Get('getCount')
  async getCount() {
    const count = await this.studentsService.getCount();
    return count;
  }

  @UseGuards(AuthGuard('school'))
  @Get('getCountByStd')
  async getCountByStd(@Query() std) {
    const count = await this.studentsService.getCountByStd(std);
    return count;
  }

  @UseGuards(AuthGuard('school'))
  @Get('getCountBySchool')
  async getCountBySchool(@Query() school) {
    const count = await this.studentsService.getCountBySchool(school);
    return count;
  }
}
