import { customAlphabet } from 'nanoid';
export const generateRandomString = customAlphabet(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  13,
);
