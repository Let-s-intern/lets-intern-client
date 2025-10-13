'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminHome = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/programs');
  }, [router]);

  return <></>;
};

export default AdminHome;