import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { accountType, authProviderSchema, grade } from '../schema';
import axios from '../utils/axios';

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

const useUserQueryKey = 'useUserQueryKey';

export const useUserQuery = ({ enabled }: { enabled?: boolean } = {}) => {
  return useQuery({
    enabled,
    queryKey: [useUserQueryKey],
    queryFn: async () => {
      const res = await axios.get(`/user`);
      return userSchema.parse(res.data.data);
    },
  });
};
