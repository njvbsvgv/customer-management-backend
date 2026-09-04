import { randomInt } from 'crypto';

interface ResetCodeData {
  code: number;
  expiresAt: number;
}

const resetCodes = new Map<string, ResetCodeData>();

const EXPIRE_TIME = 1 * 60 * 1000; // 2 minutes

export const confirmCodeGenerator = (userId: string): number => {
  const code = randomInt(100000, 1000000);

  resetCodes.set(userId, {
    code,
    expiresAt: Date.now() + EXPIRE_TIME,
  });

  return code;
};

export const verifyResetCode = (
  userId: string,
  code: number,
): {
  message:
    'success✅' | 'confirmCode is wrong⚠️' | 'confirmCode expired🚫, please trying request confirmCode' | 'error';
  status: boolean;
} => {
  const data = resetCodes.get(userId);

  if (!data) {
    return { message: 'error', status: false };
  }

  if (Date.now() > data.expiresAt) {
    resetCodes.delete(userId);
    return { message: 'confirmCode expired🚫, please trying request confirmCode', status: false };
  }

  if (data.code !== code) {
    return { message: 'confirmCode is wrong⚠️', status: false };
  }

  // یک‌بار مصرف
  resetCodes.delete(userId);

  return { message: 'success✅', status: true };
};
