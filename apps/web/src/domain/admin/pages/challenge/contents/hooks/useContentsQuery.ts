'use client';

import { getContentsAdmin } from '@/schema';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';

const useContentsQuery = () => {
  return useQuery({
    queryKey: ['contents', 'admin'],
    queryFn: async () => {
      const res = await axios.get('/contents/admin?size=1000');
      return getContentsAdmin.parse(res.data.data);
    },
  });
};

export default useContentsQuery;
