import { ReactNode } from 'react';

interface IfProps {
  condition: boolean;
  children: ReactNode;
}

export const If = ({ condition, children }: IfProps) => {
  return condition ? <>{children}</> : null;
};
