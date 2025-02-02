import { Metadata } from 'next';

export const metadata: Metadata = {
  other: {
    abd: 'asdf',
  },
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
