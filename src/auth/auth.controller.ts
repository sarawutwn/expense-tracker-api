import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('/sign-in')
  signin(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  refreshTokens(@Req() req: Request) {
    const user_id = req.user['payload'].sub;
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshToken(user_id, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
    return { statusCode: 200, message: 'Logged out.' };
  }
}
