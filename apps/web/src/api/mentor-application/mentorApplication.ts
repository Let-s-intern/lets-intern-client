import axios from '@/utils/axios';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

const createMentorApplicationResponseSchema = z.object({
  applicationId: z.number(),
});

/**
 * 멘토 합류 신청 (비로그인 허용). POST /api/v1/mentor-application
 * multipart: `request`(JSON) + 선택 `file`(PDF). 본문은 `domain/mentor-apply` 가 만든다
 */
export const useCreateMentorApplicationMutation = () =>
  useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.post('/mentor-application', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return createMentorApplicationResponseSchema.parse(res.data.data);
    },
  });
