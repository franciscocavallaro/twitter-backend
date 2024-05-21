import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator'
import { Privacy } from '@prisma/client'

export class TokenDTO {
  token!: string
}

export class SignupInputDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
    email: string

  @IsString()
  @IsNotEmpty()
    username: string

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
    password: string

  @IsEnum(Privacy)
  @IsNotEmpty()
    privacy: Privacy

  constructor (email: string, username: string, password: string, privacy: Privacy) {
    this.email = email
    this.password = password
    this.username = username
    this.privacy = privacy
  }
}

export class LoginInputDTO {
  @IsOptional()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
    email?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
    username?: string

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
    password!: string
}
