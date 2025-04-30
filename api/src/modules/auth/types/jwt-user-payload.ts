import { UserRole } from 'src/modules/users/enums/user-role.enum';

export type JwtUserPayload = {
  sub: string;
  role: UserRole;
};
