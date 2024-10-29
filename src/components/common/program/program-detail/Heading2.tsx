import { ReactNode } from 'react';

function Heading2({ children }: { children: ReactNode }) {
  return (
    <h2 className="whitespace-pre-line text-small20 font-bold lg:text-center lg:text-xlarge28">
      {children}
    </h2>
  );
}

export default Heading2;
