import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import session from 'express-session';
import passport from 'passport';

export function setupApp(app: INestApplication) {
  const configService = app.get(ConfigService);

//   app.setGlobalPrefix(configService.get<string>('GLOBAL_PREFIX') ?? '');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      secret: configService.get<string>('SECRET_KEY') as string,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
}