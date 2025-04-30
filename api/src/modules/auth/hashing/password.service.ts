import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class PasswordService {
  saltRounds = 10;

  hash(password: string) {
    return hash(password, this.saltRounds);
  }

  compare(password: string, hashedPassword: string) {
    return compare(password, hashedPassword);
  }
}
