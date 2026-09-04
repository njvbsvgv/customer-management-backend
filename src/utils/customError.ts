import { HttpException } from '@nestjs/common';

const customError = (message: string, statusCode: number) => {
  const newError = new HttpException(message, statusCode);
  throw newError;
};

export default customError;
