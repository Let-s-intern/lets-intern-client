import { customAlphabet } from 'nanoid';

export const generateRandomString = customAlphabet(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  2,
);

export const generateRandomNumber = customAlphabet('1234567890', 6);
