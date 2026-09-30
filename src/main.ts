import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup-app.ts';

let cachedServer: any;

async function createApp() {
  const app = await NestFactory.create(AppModule);
  setupApp(app);
  return app;
}

// vercel start
export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    const app = await createApp();
    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer(req, res);
}

// local start
if (require.main === module) {
  createApp().then((app) => {
    const configService = app.get(ConfigService);
    return app.listen(configService.get<number>('PORT') ?? 3000);
  });
}