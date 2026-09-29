// import { ConfigService } from '@nestjs/config';
// import { NestFactory } from '@nestjs/core';
// import session from 'express-session';
// import passport from 'passport';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const configService = app.get(ConfigService);
//   app.setGlobalPrefix(configService.get<string>('GLOBAL_PREFIX') ?? '');
//   app.use(
//     session({
//       secret: configService.get<string>('SECRET_KEY'),
//       resave: false,
//       saveUninitialized: false,
//     }),
//   );
//   app.use(passport.initialize());
//   app.use(passport.session());

//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();


import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import session from 'express-session';
import passport from 'passport';
import express from 'express';
import { AppModule } from './app.module';

let cachedApp: express.Express | undefined;

async function bootstrap(): Promise<express.Express> {
  const server = express();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  const configService = app.get(ConfigService);

  app.setGlobalPrefix(
    configService.get<string>('GLOBAL_PREFIX') ?? '',
  );

  app.use(
    session({
      secret:
        configService.get<string>('SECRET_KEY') ?? 'fallback-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.init();

  return server;
}

export default async function handler(
  req: express.Request,
  res: express.Response,
) {
  if (!cachedApp) {
    cachedApp = await bootstrap();
  }

  return cachedApp(req, res);
}