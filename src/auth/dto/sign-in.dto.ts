import { IsEmail, IsNotEmpty, Min } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  user_email: string;

  @IsNotEmpty()
  user_password: string;
}
