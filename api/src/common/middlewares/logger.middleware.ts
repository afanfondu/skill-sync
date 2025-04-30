import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    const { originalUrl, method } = req;
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] ${method} ${originalUrl}`);

    next();
  }
}
