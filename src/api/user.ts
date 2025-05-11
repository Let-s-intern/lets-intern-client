import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  accountType,
  authProviderSchema,
  grade,
  userAdminDetailType,
  userAdminType,
} from '../schema';
import axios from '../utils/axios';
import { isAdminSchema } from './userSchema';

export const UseUserAdminQueryKey = 'useUserListQueryKey';

export const useUserAdminQuery = ({
  email,
  name,
  phoneNum,
  pageable,
}: {
  email?: string;
  name?: string;
  phoneNum?: string;
  pageable?: {
    page: number;
    size: number;
  };
}) => {
  return useQuery({
    queryKey: [UseUserAdminQueryKey, email, name, phoneNum, pageable],
    queryFn: async () => {
      const res = await axios.get('/user/admin', {
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
  name: string;
  email: string;
  contactEmail: string | null;
  phoneNum: string;
  university: string | null;
  inflowPath: string | null;
  grade: string | null;
  major: string | null;
  wishJob: string | null;
  wishCompany: string | null;
};

export const usePatchUserAdminMutation = ({
  userId,
  successCallback,
  errorCallback,
}: {
  userId: number;
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
}) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (userForm: PatchUserType) => {
      await axios.patch(`/user/${userId}`, userForm);
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
  id: z.string().nullable(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  contactEmail: z.string().nullable(),
  phoneNum: z.string().nullable(),
  university: z.string().nullable(),
  grade: grade.nullable(),
  major: z.string().nullable(),
  wishJob: z.string().nullable(),
  wishCompany: z.string().nullable(),
  accountType: accountType.nullable(),
  accountNum: z.string().nullable(),
  marketingAgree: z.boolean().nullable(),
  authProvider: authProviderSchema.nullable(),
});

export type User = z.infer<typeof userSchema>;

const useUserQueryKey = 'useUserQueryKey';

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
  wishCompany?: string | null;
  marketingAgree?: boolean;
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
