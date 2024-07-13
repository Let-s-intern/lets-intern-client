import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userAdminType } from '../schema';
import axios from '../utils/axios';

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
      console.log('onSuccess');
      client
        .invalidateQueries({
          queryKey: [UseUserAdminQueryKey],
        })
        .then(() => {
          console.log('invalidateQueries success');
          successCallback && successCallback();
        });
    },
    onError: (error: Error) => {
      errorCallback && errorCallback(error);
    },
  });
};
