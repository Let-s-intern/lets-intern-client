import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Faq, ProgramTypeUpperCase, faqSchema } from '@/schema';
import axios from '@/utils/axios';

export const useGetFaq = (programType: ProgramTypeUpperCase) => {
  return useQuery({
    queryKey: ['useGetFaq', programType],
    queryFn: async () => {
      const res = await axios.get('/faq', { params: { type: programType } });

      return faqSchema.parse(res.data.data);
    },
    refetchOnWindowFocus: false,
  });
};

export const useDeleteFaq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (faqId: number | string) => {
      const res = await axios.delete(`/faq/${faqId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetFaq'] });
    },
  });
};

export const usePatchFaq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      question,
      answer,
      category,
      faqProgramType,
    }: Faq) => {
      const res = await axios.patch(`/faq/${id}`, {
        question,
        answer,
        category,
        type: faqProgramType,
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['useGetFaq'] });
    },
  });
};

export const usePostFaq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (programType: ProgramTypeUpperCase) => {
      const res = await axios.post('/faq', {
        question: '',
        answer: '',
        category: '',
        type: programType,
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['useGetFaq'] });
    },
  });
};
