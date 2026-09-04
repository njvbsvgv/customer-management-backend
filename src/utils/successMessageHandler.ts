import { HttpException } from '@nestjs/common';

const successMessageHandler = (message: string | any, statusCode: number) => {
  return new HttpException(message, statusCode);
};

export default successMessageHandler;
