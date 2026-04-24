/* eslint-disable no-console */

import { CreateContentsReq, UpdateContentsReq } from '@/schema';
import axios from '@/utils/axios';
import { useMutation } from '@tanstack/react-query';

const useContentsMutations = () => {
  const createMutation = useMutation({
    mutationFn: async (req: CreateContentsReq) => {
      const res = await axios.post('/contents', req);
      if (res.status !== 200) {
        console.warn(res);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (req: UpdateContentsReq & { id: number }) => {
      const { id, ...payload } = req;
      const res = await axios.patch(`/contents/${id}`, payload);
      if (res.status !== 200) {
        console.warn(res);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`/contents/${id}`);
      if (res.status !== 200) {
        console.warn(res);
      }
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};

export default useContentsMutations;
