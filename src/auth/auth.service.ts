import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.prisma.users.findUnique({
      where: {
        user_email: createUserDto.user_email,
      },
      select: {
        user_id: true,
      },
    });
    if (userExists) {
      throw new BadRequestException('User already has.');
    }
    const hash = await this.hashData(createUserDto.user_password);
    const newUser = await this.prisma.users.create({
      data: {
        user_email: createUserDto.user_email,
        user_password: hash,
      },
      select: {
        user_id: true,
        user_email: true,
      },
    });
    const tokens = await this.getTokens(newUser.user_id, newUser.user_email);
    await this.updateRefreshToken(newUser.user_id, tokens.refreshToken);
    return {
      statusCode: 201,
      message: 'success',
      acecssToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.prisma.users.findUnique({
      where: { user_email: signInDto.user_email },
      select: {
        user_id: true,
        user_email: true,
        user_password: true,
      },
    });
    if (!user) throw new BadRequestException('User does not exist.');
    let comparePassword = await argon2.verify(
      user.user_password,
      signInDto.user_password,
    );
    if (!comparePassword) {
      throw new BadRequestException('Password is incorrect.');
    }
    const tokens = await this.getTokens(user.user_id, user.user_email);
    await this.updateRefreshToken(user.user_id, tokens.refreshToken);
    return {
      statusCode: 201,
      message: 'success',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async refreshToken(user_id: string, refresh_token: string) {
    const user = await this.prisma.users.findUnique({ where: { user_id } });
    if (!user || !user.refresh_token) {
      throw new ForbiddenException('Access Denied');
    }
    const refreshTokenMatches = await argon2.verify(
      user.refresh_token,
      refresh_token,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.getTokens(user_id, user.user_email);
    await this.updateRefreshToken(user_id, tokens.refreshToken);
    return {
      statusCode: 201,
      message: 'success',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(user_id: string) {
    return this.prisma.users.update({
      where: { user_id },
      data: { refresh_token: null },
    });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async getTokens(user_id: string, user_email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user_id,
          user_email,
        },
        {
          secret: process.env.ACCESS_SECRET_KEY,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user_id,
          user_email,
        },
        {
          secret: process.env.REFRESH_SECRET_KEY,
          expiresIn: '7d',
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(user_id: string, refresh_token: string) {
    const hashedRefreshToken = await this.hashData(refresh_token);
    await this.prisma.users.update({
      where: { user_id },
      data: { refresh_token: hashedRefreshToken },
    });
  }
}
