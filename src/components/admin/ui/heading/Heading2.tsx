import { ReactNode } from 'react';

interface Heading2Props {
  children: ReactNode;
}

export function Heading2({ children }: Heading2Props) {
  return <h2 className="text-medium22 font-bold">{children}</h2>;
}
