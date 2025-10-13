'use client';

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
