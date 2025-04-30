import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtUserPayload } from '../auth/types/jwt-user-payload';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('current-user')
  getUser(@CurrentUser() user: JwtUserPayload) {
    return this.userService.getUser(user.sub);
  }
}
