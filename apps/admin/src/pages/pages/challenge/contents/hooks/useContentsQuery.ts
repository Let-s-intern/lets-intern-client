import { getContentsAdmin } from '@/schema';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';

const useContentsQuery = (page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: ['contents', 'admin', page, size],
    queryFn: async () => {
      const res = await axios.get(`/contents/admin?page=${page}&size=${size}`);
      return getContentsAdmin.parse(res.data.data);
    },
  });
};

export default useContentsQuery;
