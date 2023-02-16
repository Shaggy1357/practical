import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserLogin } from './dto/userLogin.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(FileInterceptor('file', Storage))
  @Post('/signUp')
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    const { access_token, newUser } = await this.userService.create(
      createUserDto,
      file,
    );
    return { access_token, newUser };
  }

  @Post('/login')
  async userLogin(@Body() userLogin: UserLogin) {
    const { access_token, existingUser } = await this.userService.login(
      userLogin,
    );
    return { access_token, existingUser };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
