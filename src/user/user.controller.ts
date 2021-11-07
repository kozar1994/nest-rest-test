import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { UserLoginDto } from './dto/userLoginDto';
import { UserResponseInterface } from './type/userResponse.interface';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') dtoUser: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(dtoUser);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body('user') user: UserLoginDto,
  ): Promise<UserResponseInterface> {
    const isUserLogin = await this.userService.loginUser(user);
    return this.userService.buildUserResponse(isUserLogin);
  }
}
