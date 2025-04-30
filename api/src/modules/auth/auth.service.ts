import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PasswordService } from './hashing/password.service';
import { Response } from 'express';
import { TokenService } from './token/token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto, response: Response) {
    const { password, email } = registerDto;
    const userExists = await this.userRepository.findOneBy({ email });
    if (userExists)
      throw new BadRequestException('User already exists. Login instead!');

    const hashedPassword = await this.passwordService.hash(password);
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    const accessToken = this.tokenService.generateAccessToken(user);
    const refreshToken = this.tokenService.generateRefreshToken(user);
    this.tokenService.setRefreshTokenCookie(response, refreshToken);

    return { accessToken };
  }

  async login(loginDto: LoginDto, response: Response) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOneBy({ email });
    if (!user)
      throw new BadRequestException('User not exists. Register first!');

    const passwordsMatch = await this.passwordService.compare(
      password,
      user.password,
    );
    if (!passwordsMatch)
      throw new BadRequestException('Invalid email or password!');

    const accessToken = this.tokenService.generateAccessToken(user);
    const refreshToken = this.tokenService.generateRefreshToken(user);
    this.tokenService.setRefreshTokenCookie(response, refreshToken);

    return { accessToken };
  }

  async refreshToken(refreshToken: string, response: Response) {
    if (!refreshToken) throw new ForbiddenException('Access denied');

    const payload = this.tokenService.verifyToken(refreshToken);

    const user = await this.userRepository.findOneBy({ id: payload.sub });
    if (!user) throw new ForbiddenException('Access denied');

    const accessToken = this.tokenService.generateAccessToken(user);
    const newRefreshToken = this.tokenService.generateRefreshToken(user);

    this.tokenService.setRefreshTokenCookie(response, newRefreshToken);

    return { accessToken };
  }

  logout(response: Response) {
    this.tokenService.clearRefreshTokenCookie(response);
  }
}
