import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

function InstructionText({ children }: Props) {
  return <p className="font-semibold text-neutral-0">{children}</p>;
}

export default InstructionText;
