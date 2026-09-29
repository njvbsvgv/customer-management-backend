import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../src/app.module';
// import { setupApp } from '../src/setup-app';
import { AppModule } from 'src/app.module.js';
import { setupApp } from 'src/setup-app.ts';

let cachedServer: any;

export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    setupApp(app);
    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer(req, res);
}