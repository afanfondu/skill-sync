import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { JwtUserPayload } from 'src/modules/auth/types/jwt-user-payload';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[] | undefined>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!roles) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'] as JwtUserPayload;

    if (!roles.includes(user.role))
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    return true;
  }
}
