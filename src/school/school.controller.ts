import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { SchoolLogin } from './dto/schoolLogin.dto';
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

@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('photo', Storage))
  create(
    @Body() createSchoolDto: CreateSchoolDto,
    @UploadedFile()
    photo: Express.Multer.File,
  ) {
    return this.schoolService.create(createSchoolDto, photo);
  }

  @Post('/login')
  async userLogin(@Body() userLogin: SchoolLogin) {
    const { access_token, existingUser } = await this.schoolService.login(
      userLogin,
    );
    return { access_token, existingUser };
  }

  @UseGuards(AuthGuard('school'))
  @Get('findAll')
  async findAll(@Query() query) {
    return this.schoolService.findAll(query);
  }

  @UseGuards(AuthGuard('school'))
  @Get('findById/:id')
  async findOne(@Param('id') id: string) {
    return this.schoolService.findOne(+id);
  }

  @UseGuards(AuthGuard('school'))
  @Patch('/update/:id')
  @UseInterceptors(FileInterceptor('photo', Storage))
  async update(
    @Param('id') id: string,
    @Body() updateSchoolDto: UpdateSchoolDto,
    @UploadedFile()
    photo: Express.Multer.File,
  ) {
    return this.schoolService.update(+id, updateSchoolDto, photo);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolService.remove(+id);
  }
}
