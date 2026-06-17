import { customAlphabet } from 'nanoid';

export const generateRandomString = customAlphabet(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  2,
);

export const generateRandomNumber = customAlphabet('1234567890', 6);

export const generateUUID = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substring(0, 5);
