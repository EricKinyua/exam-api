import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export enum SignUpRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

export class SignUpDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @ApiProperty({ enum: SignUpRole })
  @IsEnum(SignUpRole)
  role: SignUpRole;

  @ApiPropertyOptional({ description: 'Required when role is STUDENT' })
  @ValidateIf((o) => o.role === SignUpRole.STUDENT)
  @IsString()
  @IsNotEmpty({
    message: 'studentClass is required when signing up as STUDENT',
  })
  studentClass?: string;
}
