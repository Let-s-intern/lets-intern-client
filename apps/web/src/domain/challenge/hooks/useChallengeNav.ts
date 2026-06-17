import { useSearchParams } from 'next/navigation';

const useChallengeNav = () => {
  const searchParams = useSearchParams();
  const testDate = searchParams.get('testDate') ?? undefined;

  const withTestDate = (path: string) => {
    if (!testDate) return path;
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}testDate=${testDate}`;
  };

  return { withTestDate, testDate };
};

export default useChallengeNav;
