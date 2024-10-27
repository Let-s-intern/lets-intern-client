import dayjs from 'dayjs';
import { createContext, useContext } from 'react';
import { ChallengeIdSchema } from '../schema';

export const mockChallenge: ChallengeIdSchema = {
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
  challenge: ChallengeIdSchema;
  children: React.ReactNode;
}> = ({ children, challenge }) => {
  return <context.Provider value={{ challenge }}>{children}</context.Provider>;
};

// TODO: Server로부터 넘어온 데이터는 모두 Serialized된 데이터임. 근간부터 수정해야 함. 일단 임시로 변환하여 넘겨주기.
export const useServerChallenge = (): ChallengeIdSchema => {
  const challenge = useContext(context).challenge;

  return {
    ...challenge,
    beginning: challenge.beginning ? dayjs(challenge.beginning) : null,
    deadline: challenge.deadline ? dayjs(challenge.deadline) : null,
    endDate: challenge.endDate ? dayjs(challenge.endDate) : null,
    startDate: challenge.startDate ? dayjs(challenge.startDate) : null,
  };
};
