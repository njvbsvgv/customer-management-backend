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


// import { ConfigService } from '@nestjs/config';
// import { NestFactory } from '@nestjs/core';
// import session from 'express-session';
// import passport from 'passport';
// import { AppModule } from './app.module';

// let cachedServer: any;

// async function createApp() {
//   const app = await NestFactory.create(AppModule);
//   const configService = app.get(ConfigService);

//   app.setGlobalPrefix(configService.get<string>('GLOBAL_PREFIX') ?? '');
//   app.use(
//     session({
//       secret: configService.get<string>('SECRET_KEY') as string,
//       resave: false,
//       saveUninitialized: false,
//     }),
//   );
//   app.use(passport.initialize());
//   app.use(passport.session());

//   return app;
// }

// // برای Vercel
// export default async function handler(req: any, res: any) {
//   if (!cachedServer) {
//     const app = await createApp();
//     await app.init();
//     cachedServer = app.getHttpAdapter().getInstance();
//   }
//   return cachedServer(req, res);
// }

// // برای اجرای لوکال
// if (!process.env.VERCEL) {
//   createApp().then((app) => app.listen(process.env.PORT ?? 3000));
// }


import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup-app.ts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupApp(app);
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT') ?? 3000);
}
bootstrap();