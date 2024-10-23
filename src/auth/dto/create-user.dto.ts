import { IsEmail, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  user_email: string;

  @IsNotEmpty()
  user_password: string;
}
