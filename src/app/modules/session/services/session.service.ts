import { SessionServiceInterface } from './session.service.interface';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostLoginResDto } from '@app/modules/session/dtos/responses/post-login-res.dto';
import { PostLoginReqDto } from '@app/modules/session/dtos/requests/post-login-req.dto';
import {
  getJsonWebToken,
  encodePassword,
} from '@app/modules/session/utils/session.util';
import { UserDto } from '@app/modules/user/dtos/user.dto';
import { User } from '@app/modules/user/models/user.model';

@Injectable()
export class SessionService implements SessionServiceInterface {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private readonly configService: ConfigService,
  ) {}

  async postLogin(body: PostLoginReqDto): Promise<PostLoginResDto> {
    const secret = this.configService.get('auth.secret');
    const salt = this.configService.get('auth.salt');

    const user = await this.userModel.findOne({
      where: {
        email: body?.email,
        password: encodePassword(salt, body?.password),
      },
    });

    this.validateCredentials(user);

    return { jwt: getJsonWebToken(user.id, user.isAdmin, secret) };
  }

  private validateCredentials(user: UserDto) {
    if (!user) {
      throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
    }
  }
}
