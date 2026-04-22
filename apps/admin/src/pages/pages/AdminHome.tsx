// TODO: next/ → react-router-dom 또는 공유 어댑터로 교체 필요 (Vite 이전)
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AdminHome = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/programs');
  }, [router]);

  return <></>;
};

export default AdminHome;
