import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto, SignUpRole } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { Role, User } from '../../generated/prisma/client';

const SALT_ROUNDS = 10;

export interface AuthUserResponse {
  id: string;
  email: string;
  name: string;
  role: Role;
  studentClass?: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    dto: SignUpDto,
  ): Promise<{ user: AuthUserResponse; access_token: string }> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = bcrypt.hashSync(dto.password, SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        role: dto.role as Role,
        studentClass:
          dto.role === SignUpRole.STUDENT ? (dto.studentClass ?? null) : null,
      },
    });

    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    } as JwtPayload);

    return {
      user: this.toUserResponse(user),
      access_token,
    };
  }

  async signIn(
    dto: SignInDto,
  ): Promise<{ user: AuthUserResponse; access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = bcrypt.compareSync(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    } as JwtPayload);

    return {
      user: this.toUserResponse(user),
      access_token,
    };
  }

  private toUserResponse(
    user: Pick<User, 'id' | 'email' | 'name' | 'role' | 'studentClass'>,
  ): AuthUserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      studentClass: user.studentClass ?? undefined,
    };
  }
}
