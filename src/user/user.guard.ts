import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TOKEN } from 'src/constants/bearer';

/**
 * @description
 * accessToken이 유효한지 확인
 */

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeader(request);

    if (!accessToken) throw new BadRequestException();
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });
      request.userId = payload.sub;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === TOKEN.BEARER_PREFIX ? token : null;
  }
}
