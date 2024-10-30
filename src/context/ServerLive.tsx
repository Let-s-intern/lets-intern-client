import dayjs from 'dayjs';
import { createContext, useContext } from 'react';
import { LiveIdSchema } from '../schema';

export const mockLive: LiveIdSchema = {
  beginning: dayjs(),
  classificationInfo: [],
  deadline: dayjs(),
  endDate: dayjs(),
  faqInfo: [],
  priceInfo: {
    priceId: 0,
    price: 0,
    discount: 0,
    accountNumber: '',
    deadline: dayjs(),
  },
  startDate: dayjs(),
  title: '로딩중...',
};

const context = createContext({
  live: mockLive,
});

export const ServerLiveProvider: React.FC<{
  live: LiveIdSchema;
  children: React.ReactNode;
}> = ({ children, live }) => {
  return <context.Provider value={{ live }}>{children}</context.Provider>;
};

// TODO: Server로부터 넘어온 데이터는 모두 Serialized된 데이터임. 근간부터 수정해야 함. 일단 임시로 변환하여 넘겨주기.
export const useServerLive = (): LiveIdSchema => {
  const live = useContext(context).live;

  return {
    ...live,
    beginning: live.beginning ? dayjs(live.beginning) : null,
    deadline: live.deadline ? dayjs(live.deadline) : null,
    endDate: live.endDate ? dayjs(live.endDate) : null,
    startDate: live.startDate ? dayjs(live.startDate) : null,
    priceInfo: {
      ...live.priceInfo,
      deadline: live.priceInfo.deadline ? dayjs(live.priceInfo.deadline) : null,
    },
  };
};
