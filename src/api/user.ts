import axios from '@/utils/axios';
import axiosV2 from '@/utils/axiosV2';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  accountType,
  authProviderSchema,
  grade,
  userAdminDetailType,
} from '../schema';
import {
  challengeMentorVoSchema,
  isAdminSchema,
  isMentorSchema,
  mentorListSchema,
  userAdminType,
  userDocumentListSchema,
  UserExperience,
} from './userSchema';

export const UseMentorListQueryKey = 'useMentorListQueryKey';

export const useMentorListQuery = () => {
  return useQuery({
    queryKey: [UseMentorListQueryKey],
    queryFn: async () => {
      const res = await axiosV2.get('/admin/user/mentor');
      return mentorListSchema.parse(res.data.data);
    },
  });
};

export const UseUserAdminQueryKey = 'useUserListQueryKey';

export const useUserAdminQuery = ({
  email,
  name,
  phoneNum,
  pageable,
}: {
  email?: string | null;
  name?: string | null;
  phoneNum?: string | null;
  pageable?: {
    page: number;
    size: number;
  };
} = {}) => {
  return useQuery({
    queryKey: [UseUserAdminQueryKey, email, name, phoneNum, pageable],
    queryFn: async () => {
      const res = await axiosV2.get('/admin/user', {
        params: {
          email,
          name,
          phoneNum,
          ...pageable,
        },
      });
      return userAdminType.parse(res.data.data);
    },
  });
};

export const useDeleteUserMutation = (
  successCallback?: () => void,
  errorCallback?: (error: Error) => void,
) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (phoneNumber: string) => {
      await axios.delete(`/user/admin?number=${phoneNumber}`);
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [UseUserAdminQueryKey],
      });

      return successCallback && successCallback();
    },
    onError: (error: Error) => {
      return errorCallback && errorCallback(error);
    },
  });
};

export const UseUserDetailAdminQueryKey = 'useUserDetailQueryKey';

export const useUserDetailAdminQuery = ({
  userId,
  enabled,
}: {
  userId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [UseUserDetailAdminQueryKey, userId],
    queryFn: async () => {
      const res = await axios.get(`/user/${userId}`);
      return userAdminDetailType.parse(res.data.data);
    },
  });
};

export type PatchUserType = {
  id?: string | number;
  name?: string;
  email?: string;
  contactEmail?: string | null;
  phoneNum?: string;
  university?: string | null;
  inflowPath?: string | null;
  grade?: string | null;
  major?: string | null;
  wishJob?: string | null;
  wishCompany?: string | null;
  isMentor?: boolean;
  careerType?: string | null;
  memo?: string | null;
};

export const usePatchUserAdminMutation = ({
  userId,
  successCallback,
  errorCallback,
}: {
  userId?: number | string;
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (userForm: PatchUserType) => {
      const { id, ...rest } = userForm;
      await axios.patch(`/user/${userId ?? id}`, rest);
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [UseUserAdminQueryKey, UseUserDetailAdminQueryKey, userId],
      });
      return successCallback && successCallback();
    },
    onError: (error: Error) => {
      return errorCallback && errorCallback(error);
    },
  });
};

/** GET /api/v1/user */
const userSchema = z.object({
  userId: z.number(),
  id: z.string().nullable(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  contactEmail: z.string().nullable(),
  phoneNum: z.string().nullable(),
  university: z.string().nullable(),
  inflowPath: z.string().nullable(),
  grade: grade.nullable(),
  major: z.string().nullable(),
  wishField: z.string().nullable(),
  wishJob: z.string().nullable(),
  wishIndustry: z.string().nullable(),
  wishEmploymentType: z.string().nullable(),
  wishCompany: z.string().nullable(),
  accountType: accountType.nullable(),
  accountNum: z.string().nullable(),
  marketingAgree: z.boolean().nullable(),
  authProvider: authProviderSchema.nullable(),
  role: z.string().nullable(),
  careerType: z.enum(['QUALIFIED', 'NONE']).nullable(),
  memo: z.string().nullable(),
  isPoolUp: z.boolean().nullable(),
});

export type User = z.infer<typeof userSchema>;

/** GET /api/v1/user */
export const useUserQueryKey = 'useUserQueryKey';

export const useUserQuery = ({
  ...options
}: { enabled?: boolean; retry?: boolean | number } = {}) => {
  return useQuery({
    ...options,
    queryKey: [useUserQueryKey],
    queryFn: async () => {
      const res = await axios.get(`/user`);
      return userSchema.parse(res.data.data);
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetUserAdmin = ({
  ...options
}: { enabled?: boolean; retry?: boolean | number } = {}) => {
  return useQuery({
    queryKey: ['useGetUserAdmin'],
    queryFn: async () => {
      const res = await axios.get('/user/isAdmin');
      return isAdminSchema.parse(res.data.data);
    },
    ...options,
  });
};

export type PatchUserBody = {
  name?: string;
  email?: string;
  contactEmail?: string | null;
  phoneNum?: string;
  university?: string | null;
  inflowPath?: string | null;
  grade?: string | null;
  major?: string | null;
  wishJob?: string | null;
  wishField?: string | null;
  wishCompany?: string | null;
  wishIndustry?: string | null;
  wishEmploymentType?: string | null;
  marketingAgree?: boolean;
  accountType?: string | null;
  accountNum?: string | null;
  accountOwner?: string | null;
  isPoolUp?: boolean;
};

export const usePatchUser = (
  successCallback?: () => void,
  errorCallback?: (error: Error) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: PatchUserBody) => {
      return await axios.patch('/user', body);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [useUserQueryKey] });
      return successCallback && successCallback();
    },
    onError: (error: Error) => {
      return errorCallback && errorCallback(error);
    },
  });
};

/** PATCH /api/v2/admin/user/{userId}/pool-up */
export const usePatchUserPoolUpMutation = (
  successCallback?: () => void,
  errorCallback?: (error: Error) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      isPoolUp,
    }: {
      userId: number;
      isPoolUp: boolean;
    }) => {
      return await axiosV2.patch(`/admin/user/${userId}/pool-up`, { isPoolUp });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [useUserQueryKey] });
      return successCallback && successCallback();
    },
    onError: (error: Error) => {
      return errorCallback && errorCallback(error);
    },
  });
};

const mentorChallengeListSchema = z.object({
  myChallengeMentorVoList: z.array(challengeMentorVoSchema),
});

export type MentorChallengeList = z.infer<typeof mentorChallengeListSchema>;
export type ChallengeMentorVo = z.infer<typeof challengeMentorVoSchema>;

const UseMentorChallengeListQueryKey = 'useMentorChallengeListQueryKey';

export const useMentorChallengeListQuery = ({
  ...options
}: { enabled?: boolean; retry?: boolean | number } = {}) => {
  return useQuery({
    ...options,
    queryKey: [UseMentorChallengeListQueryKey],
    queryFn: async () => {
      const res = await axios.get('/challenge-mentor');
      return mentorChallengeListSchema.parse(res.data.data);
    },
    refetchOnWindowFocus: false,
  });
};

export type IsMentor = z.infer<typeof isMentorSchema>;

const UseIsMentorQueryKey = 'useIsMentorQueryKey';

export const useIsMentorQuery = ({
  ...options
}: { enabled?: boolean; retry?: boolean | number } = {}) => {
  return useQuery({
    ...options,
    queryKey: [UseIsMentorQueryKey],
    queryFn: async () => {
      const res = await axiosV2.get('/user/is-mentor');
      return isMentorSchema.parse(res.data.data);
    },
    refetchOnWindowFocus: false,
  });
};

/** 유저 관리자 여부 /api/v1/user/isAdmin */
export const useIsAdminQuery = () => {
  return useQuery({
    queryKey: ['useIsAdminQuery'],
    queryFn: async () => {
      const res = await axios.get('/user/isAdmin');
      return isAdminSchema.parse(res.data.data);
    },
  });
};

/** GET [유저] 서류(자소서, 포트폴리오 등) 조회 /api/v1/user-document */
export const UseGetUserDocumentListQueryKey = 'useGetUserDocumentListQueryKey';
export const useGetUserDocumentListQuery = () => {
  return useQuery({
    queryKey: [UseGetUserDocumentListQueryKey],
    queryFn: async () => {
      const res = await axios.get('/user-document');
      return userDocumentListSchema.parse(res.data.data);
    },
  });
};

/** DELETE [유저] 서류(자소서, 포트폴리오 등) 삭제 /api/v1/user-document/{userDocumentId}*/
export const useDeleteUserDocMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userDocumentId: number) => {
      const res = await axios.delete(`/user-document/${userDocumentId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [UseGetUserDocumentListQueryKey],
      });
    },
  });
};

/** POST [유저] 경험 정리 생성 /api/v1/user-experience */
export const usePostUserExperienceMutation = () => {
  return useMutation({
    mutationFn: async (data: UserExperience) => {
      const res = await axios.post('/user-experience', data);
      // return userExperienceInfoSchema.parse(res.data.data);
      return res.data.data;
    },
  });
};

/** PATCH [유저] 경험 정리 수정 /api/v1/user-experience/:id */
export const usePatchUserExperienceMutation = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UserExperience }) => {
      const res = await axios.patch(`/user-experience/${id}`, data);
      // return userExperienceInfoSchema.parse(res.data.data.userExperience);
      return res.data.data;
    },
  });
};

/** GET [유저] 경험 정리 조회 /api/v1/user-experience */
/** DELETE [유저] 경험 정리 삭제 /api/v1/user-experience */
