import dayjs from 'dayjs';
import { createContext, useContext } from 'react';
import { z } from 'zod';
import { getLiveIdSchema } from '../schema';

export const mockLive: z.infer<typeof getLiveIdSchema> = {
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
    accountType: null,
    livePriceType: null,
  },
  startDate: dayjs(),
  title: '로딩중...',
};

const context = createContext({
  live: mockLive,
});

export const ServerLiveProvider: React.FC<{
  live: z.infer<typeof getLiveIdSchema>;
  children: React.ReactNode;
}> = ({ children, live }) => {
  return <context.Provider value={{ live }}>{children}</context.Provider>;
};

export const useServerLive = () => {
  const live = useContext(context).live;

  return live;
};
