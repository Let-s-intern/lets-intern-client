import { generateRandomNumber, generateRandomString } from '@/utils/random';

export const generateOrderId = () => {
  return 'lets' + generateRandomString() + generateRandomNumber();
};
