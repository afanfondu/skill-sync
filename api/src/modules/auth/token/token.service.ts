import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from 'src/modules/users/entities/user.entity';
import { JwtUserPayload } from '../types/jwt-user-payload';
import tokenConfig from './token.config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(tokenConfig.KEY)
    private readonly tokenConfiguration: ConfigType<typeof tokenConfig>,
  ) {}

  generateAccessToken(user: User): string {
    const payload: JwtUserPayload = {
      sub: user.id,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      secret: this.tokenConfiguration.secret,
      expiresIn: this.tokenConfiguration.accessTokenTtl,
    });
  }

  generateRefreshToken(user: User): string {
    const payload: JwtUserPayload = {
      sub: user.id,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      secret: this.tokenConfiguration.secret,
      expiresIn: this.tokenConfiguration.refreshTokenTtl,
    });
  }

  verifyToken(token: string): JwtUserPayload {
    return this.jwtService.verify<JwtUserPayload>(token, {
      secret: this.tokenConfiguration.secret,
    });
  }

  setRefreshTokenCookie(response: Response, token: string): void {
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setTime(
      refreshTokenExpiry.getTime() +
        this.tokenConfiguration.refreshTokenTtl * 1000,
    );

    response.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: refreshTokenExpiry,
      sameSite: 'strict',
      path: '/auth/refresh',
    });
  }

  clearRefreshTokenCookie(response: Response): void {
    response.cookie('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
      sameSite: 'strict',
      path: '/auth/refresh',
    });
  }
}
