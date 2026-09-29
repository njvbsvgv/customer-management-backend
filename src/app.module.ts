import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { MediaService } from './utils/mediaUploader';
import { UserActivityModule } from './user-activity/user-activity.module';
import { SizeModule } from './size/size.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'custom-management-db',
      password: 'customManagement123456',
      database: 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    UserModule,
    ProductsModule,
    CategoryModule,
    UserActivityModule,
    SizeModule,
    
  ],
  controllers: [AppController],
  providers: [AppService, MediaService],
  exports: [MediaService]
})
export class AppModule {}
