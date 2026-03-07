import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// TODO: API 연동 후 실제 엔드포인트로 교체
// import axios from '@/utils/axios';

// --- Zod Schemas ---

const programHistoryItemSchema = z.object({
  title: z.string(),
  id: z.number(),
});

const magnetHistoryItemSchema = z.object({
  title: z.string(),
  id: z.number(),
});

const leadManagementUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  phoneNum: z.string(),
  grade: z.string(),
  wishJobGroup: z.string(),
  wishJob: z.string(),
  wishIndustry: z.string(),
  wishCompany: z.string(),
  programHistory: z.array(programHistoryItemSchema),
  magnetHistory: z.array(magnetHistoryItemSchema),
  marketingAgree: z.boolean(),
});

const questionAnswerSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const magnetApplicationSchema = z.object({
  id: z.number(),
  magnetId: z.number(),
  magnetTitle: z.string(),
  applicationDate: z.string(),
  name: z.string(),
  phoneNum: z.string(),
  grade: z.string(),
  wishJobGroup: z.string(),
  wishJob: z.string(),
  wishIndustry: z.string(),
  wishCompany: z.string(),
  defaultQuestions: z.array(questionAnswerSchema),
  selectQuestions: z.array(questionAnswerSchema),
  marketingAgree: z.boolean(),
});

// --- Types ---

export type LeadManagementUser = z.infer<typeof leadManagementUserSchema>;
export type MagnetApplication = z.infer<typeof magnetApplicationSchema>;
export type ProgramHistoryItem = z.infer<typeof programHistoryItemSchema>;
export type MagnetHistoryItem = z.infer<typeof magnetHistoryItemSchema>;

// --- Mock Data ---

const MOCK_LEAD_USERS: LeadManagementUser[] = [
  {
    id: 1,
    name: '임호정',
    phoneNum: '010-9322-8191',
    grade: '졸업',
    wishJobGroup: '렛츠커리어',
    wishJob: '렛츠커리어',
    wishIndustry: '렛츠커리어',
    wishCompany: '렛츠커리어',
    programHistory: [
      { title: '포트폴리오 챌린지', id: 260909 },
      { title: '무료 세미나', id: 250202 },
    ],
    magnetHistory: [
      { title: '이력서 탬플릿', id: 260202 },
      { title: '포트폴리오 탬플릿', id: 250909 },
    ],
    marketingAgree: true,
  },
  {
    id: 2,
    name: '김민수',
    phoneNum: '010-1234-5678',
    grade: '4학년',
    wishJobGroup: 'IT/개발',
    wishJob: '프론트엔드 개발자',
    wishIndustry: 'IT/소프트웨어',
    wishCompany: '네이버',
    programHistory: [{ title: '개발자 부트캠프', id: 260101 }],
    magnetHistory: [{ title: '이력서 탬플릿', id: 260202 }],
    marketingAgree: false,
  },
  {
    id: 3,
    name: '박지영',
    phoneNum: '010-5555-1234',
    grade: '3학년',
    wishJobGroup: '마케팅',
    wishJob: '디지털 마케터',
    wishIndustry: '광고/미디어',
    wishCompany: '카카오',
    programHistory: [
      { title: '마케팅 실무 과정', id: 260505 },
      { title: '무료 세미나', id: 250202 },
    ],
    magnetHistory: [],
    marketingAgree: true,
  },
];

const MOCK_MAGNET_APPLICATIONS: MagnetApplication[] = [
  {
    id: 1,
    magnetId: 260202,
    magnetTitle: '이력서 탬플릿',
    applicationDate: '2026-02-02',
    name: '임호정',
    phoneNum: '010-9322-8191',
    grade: '졸업',
    wishJobGroup: '렛츠커리어',
    wishJob: '렛츠커리어',
    wishIndustry: '렛츠커리어',
    wishCompany: '렛츠커리어',
    defaultQuestions: [
      { question: '현재 취업 준비 상태는?', answer: '준비 중' },
      { question: '관심 있는 직무 분야는?', answer: '기획/전략' },
    ],
    selectQuestions: [
      { question: '렛츠커리어를 알게 된 경로는?', answer: '인스타그램' },
    ],
    marketingAgree: true,
  },
  {
    id: 2,
    magnetId: 250909,
    magnetTitle: '포트폴리오 탬플릿',
    applicationDate: '2025-09-09',
    name: '임호정',
    phoneNum: '010-9322-8191',
    grade: '졸업',
    wishJobGroup: '렛츠커리어',
    wishJob: '렛츠커리어',
    wishIndustry: '렛츠커리어',
    wishCompany: '렛츠커리어',
    defaultQuestions: [
      { question: '현재 취업 준비 상태는?', answer: '준비 중' },
      { question: '관심 있는 직무 분야는?', answer: '기획/전략' },
    ],
    selectQuestions: [],
    marketingAgree: true,
  },
];

// --- Query Keys ---

export const leadManagementListQueryKey = 'leadManagementListQueryKey';
export const leadManagementUserDetailQueryKey =
  'leadManagementUserDetailQueryKey';
export const magnetApplicationListQueryKey = 'magnetApplicationListQueryKey';

// --- Query Hooks ---

// TODO: API 연동 후 실제 엔드포인트로 교체 — GET /admin/lead-management
export const useLeadManagementListQuery = (
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [leadManagementListQueryKey],
    enabled: options?.enabled ?? true,
    queryFn: async (): Promise<LeadManagementUser[]> => {
      // TODO: API 연동 후 아래 주석 해제
      // const res = await axios.get('/admin/lead-management');
      // return z.array(leadManagementUserSchema).parse(res.data.data);
      return MOCK_LEAD_USERS;
    },
  });
};

// TODO: API 연동 후 실제 엔드포인트로 교체 — GET /admin/lead-management/{userId}
export const useLeadManagementUserDetailQuery = (
  userId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [leadManagementUserDetailQueryKey, userId],
    enabled: options?.enabled ?? true,
    queryFn: async (): Promise<LeadManagementUser | null> => {
      // TODO: API 연동 후 아래 주석 해제
      // const res = await axios.get(`/admin/lead-management/${userId}`);
      // return leadManagementUserSchema.parse(res.data.data);
      return MOCK_LEAD_USERS.find((user) => user.id === userId) ?? null;
    },
  });
};

// TODO: API 연동 후 실제 엔드포인트로 교체 — GET /admin/lead-management/{userId}/magnet-applications
export const useMagnetApplicationListQuery = (
  userId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [magnetApplicationListQueryKey, userId],
    enabled: options?.enabled ?? true,
    queryFn: async (): Promise<MagnetApplication[]> => {
      // TODO: API 연동 후 아래 주석 해제
      // const res = await axios.get(`/admin/lead-management/${userId}/magnet-applications`);
      // return z.array(magnetApplicationSchema).parse(res.data.data);
      return MOCK_MAGNET_APPLICATIONS;
    },
  });
};
