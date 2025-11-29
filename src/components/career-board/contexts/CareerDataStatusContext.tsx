import { createContext, ReactNode, useContext, useState } from 'react';

interface CareerDataStatusContextValue {
  hasCareerData: boolean;
  setHasCareerData: (hasData: boolean) => void;
}

const CareerDataStatusContext =
  createContext<CareerDataStatusContextValue | null>(null);

export const CareerDataStatusProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [hasCareerData, setHasCareerData] = useState(false);

  return (
    <CareerDataStatusContext.Provider
      value={{ hasCareerData, setHasCareerData }}
    >
      {children}
    </CareerDataStatusContext.Provider>
  );
};

export const useCareerDataStatus = () => {
  const context = useContext(CareerDataStatusContext);
  if (!context) {
    throw new Error(
      'useCareerDataStatus must be used within CareerDataStatusProvider',
    );
  }
  return context;
};
