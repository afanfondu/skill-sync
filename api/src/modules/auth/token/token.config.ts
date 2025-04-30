import { registerAs } from '@nestjs/config';

export default registerAs('token', () => ({
  secret: process.env.JWT_SECRET,
  accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL || '300', 10), // 5m
  refreshTokenTtl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL || '84600', 10),
}));
