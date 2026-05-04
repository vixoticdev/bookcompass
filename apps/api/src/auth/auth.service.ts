import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signup(signupDto: SignupDto) {
    const passwordHash = await hash(signupDto.password, 12);
    const user = await this.usersService.create({
      displayName: signupDto.displayName,
      email: signupDto.email,
      passwordHash,
      role: 'reader',
    });

    return this.toAuthResponse(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email, {
      includePasswordHash: true,
    });

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordMatches = await compare(loginDto.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.toAuthResponse(user);
  }

  async me(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User no longer exists.');
    }

    return this.toPublicUser(user);
  }

  private toAuthResponse(user: {
    _id: unknown;
    displayName: string;
    email: string;
    role: 'reader' | 'admin';
  }) {
    const publicUser = this.toPublicUser(user);

    return {
      accessToken: this.jwtService.sign({
        sub: publicUser._id,
        email: publicUser.email,
        role: publicUser.role,
      }),
      user: publicUser,
    };
  }

  private toPublicUser(user: {
    _id: unknown;
    displayName: string;
    email: string;
    role: 'reader' | 'admin';
  }) {
    return {
      _id: String(user._id),
      displayName: user.displayName,
      email: user.email,
      role: user.role,
    };
  }
}
