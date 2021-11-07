import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUserDto';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { UserResponseInterface } from './type/userResponse.interface';
import { UserLoginDto } from './dto/userLoginDto';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(userDto: CreateUserDto): Promise<UserEntity> {
    const findUser = await this.userRepository.findOne({
      email: userDto.email,
    });

    if (findUser) {
      throw new HttpException(
        'This Email taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, userDto);

    console.log('newUser', newUser);
    return await this.userRepository.save(newUser);
  }

  async loginUser(user: UserLoginDto): Promise<UserEntity> {
    const isUser = this.userRepository.findOne({
      email: user.email,
    });

    if (!isUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const password = (await isUser).password;

    const checkPassword = await compare(user.password, password);

    if (!checkPassword) {
      throw new HttpException('Password not corect!!!', HttpStatus.NOT_FOUND);
    }

    return isUser;
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
