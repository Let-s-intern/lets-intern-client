import { ActiveReports } from '@/api/report';
import { createContext, useContext } from 'react';

export const mockActiveReports: ActiveReports = {
  personalStatementInfoList: [],
  portfolioInfoList: [],
  resumeInfoList: [],
};

const context = createContext({
  activeReports: mockActiveReports,
});

export const ActiveReportsProvider: React.FC<{
  activeReports: ActiveReports;
  children: React.ReactNode;
}> = ({ children, activeReports }) => {
  return (
    <context.Provider value={{ activeReports }}>{children}</context.Provider>
  );
};

/**
 * 서버사이드에서 active reports 데이터 내려줄 때 사용하는 훅.
 * 일반적인 경우에는 useGetActiveReports를 사용해야 함.
 */
export const useServerActiveReports = () => {
  const blog = useContext(context).activeReports;

  return blog;
};
