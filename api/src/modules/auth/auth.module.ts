import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PasswordService } from './hashing/password.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import tokenConfig from './token/token.config';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { TokenService } from './token/token.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync(tokenConfig.asProvider()),
    ConfigModule.forFeature(tokenConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, TokenService],
  exports: [TokenService],
})
export class AuthModule {}
