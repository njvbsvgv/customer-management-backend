import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

const jwtConfiguration = (envKey: string) => {
  return JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      global: true,
      secret: configService.get<string>(envKey),
      signOptions: {
        expiresIn: '1d',
      },
    }),
  });
};

export default jwtConfiguration