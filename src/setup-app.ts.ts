import { INestApplication, ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import passport from 'passport';

export function setupApp(app: INestApplication) {
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  // session, passport و هر تنظیم دیگری که در main.ts داری را اینجا بگذار
}