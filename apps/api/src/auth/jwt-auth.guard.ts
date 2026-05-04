import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthenticatedUser } from './auth.types';

type JwtPayload = {
  sub: string;
  email: string;
  role: 'reader' | 'admin';
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing bearer token.');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      (request as Request & { user: AuthenticatedUser }).user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    return true;
  }

  private extractToken(request: Request) {
    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];

    return scheme === 'Bearer' ? token : undefined;
  }
}
