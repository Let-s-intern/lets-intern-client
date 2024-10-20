import { ReactNode } from 'react';

export default function Header({ children }: { children: ReactNode }) {
  return (
    <header className="mb-4 flex items-center justify-between">
      {children}
    </header>
  );
}
