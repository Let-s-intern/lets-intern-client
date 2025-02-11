import { Metadata } from 'next';

export const metadata: Metadata = {
  other: {},
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
