export type EpochMs = number;

export type TokenSet = {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: EpochMs;
  refreshExpiresAt: EpochMs;
};
