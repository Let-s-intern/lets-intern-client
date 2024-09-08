import { ActiveReports } from '@/api/report';
import { createContext, useContext } from 'react';

export const mockActiveReports: ActiveReports = {
  personalStatementInfo: undefined,
  portfolioInfo: undefined,
  resumeInfo: undefined,
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

export const useActiveReports = () => {
  const blog = useContext(context).activeReports;

  return blog;
};
