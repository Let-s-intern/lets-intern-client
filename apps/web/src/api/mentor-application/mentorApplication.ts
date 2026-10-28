import axios from '@/utils/axios';
import { useMutation, useQuery } from '@tanstack/react-query';
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

const mentorApplicationStatusSchema = z.object({
  /** 시간대 없는 LocalDateTime(서울 시각). 예: `2026-10-28T10:00:05` */
  submittedAt: z.string(),
  status: z.enum(['CHECKING', 'REVIEWING', 'REPLIED']),
  /** LocalDate. 예: `2026-11-04` */
  expectedReplyDate: z.string().nullish(),
});

/** 조회 응답 `data`. `/status` 와 `/my` 가 같은 형태다. 목록은 최신순이다 */
const mentorApplicationStatusListSchema = z.object({
  applicationList: z.array(mentorApplicationStatusSchema),
});

export type MentorApplicationStatus = z.infer<
  typeof mentorApplicationStatusSchema
>;
export type MentorApplicationStatusCode = MentorApplicationStatus['status'];

export const parseMentorApplicationStatusList = (data: unknown) =>
  mentorApplicationStatusListSchema.parse(data).applicationList;

export interface MentorApplicationStatusRequest {
  name: string;
  /** 숫자만 */
  phoneNum: string;
}

/**
 * 비회원 신청 현황 조회. POST /api/v1/mentor-application/status
 * 개인정보가 URL 에 남지 않도록 POST 다. 요청이 잦으면 429 `MENTOR_APPLICATION_STATUS_TOO_MANY_REQUESTS`
 */
export const useMentorApplicationStatusMutation = () =>
  useMutation({
    mutationFn: async (body: MentorApplicationStatusRequest) => {
      const res = await axios.post('/mentor-application/status', body);
      return parseMentorApplicationStatusList(res.data.data);
    },
  });

export const MyMentorApplicationsQueryKey = 'myMentorApplications';

/** 회원 본인 신청 현황. GET /api/v1/mentor-application/my (로그인 필요, 로그인했을 때만 부른다) */
export const useMyMentorApplicationsQuery = () =>
  useQuery({
    queryKey: [MyMentorApplicationsQueryKey],
    queryFn: async () => {
      const res = await axios.get('/mentor-application/my');
      return parseMentorApplicationStatusList(res.data.data);
    },
  });
