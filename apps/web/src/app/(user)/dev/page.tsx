import { Metadata } from 'next';
import DevPage from './DevPage';

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
};

export default function Page() {
  return <DevPage />;
}
