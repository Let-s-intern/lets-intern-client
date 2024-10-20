import dayjs from 'dayjs';
import { createContext, useContext } from 'react';
import { z } from 'zod';
import { getChallengeIdSchema } from '../schema';

export const mockChallenge: z.infer<typeof getChallengeIdSchema> = {
  beginning: dayjs(),
  challengeType: 'CAREER_START',
  classificationInfo: [],
  deadline: dayjs(),
  endDate: dayjs(),
  faqInfo: [],
  priceInfo: [],
  startDate: dayjs(),
  title: '로딩중...',
};

const context = createContext({
  challenge: mockChallenge,
});

export const ServerChallengeProvider: React.FC<{
  challenge: z.infer<typeof getChallengeIdSchema>;
  children: React.ReactNode;
}> = ({ children, challenge }) => {
  return <context.Provider value={{ challenge }}>{children}</context.Provider>;
};

export const useServerChallenge = () => {
  const challenge = useContext(context).challenge;

  return challenge;
};
