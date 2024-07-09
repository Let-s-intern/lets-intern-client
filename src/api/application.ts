import { useMutation, useQuery } from '@tanstack/react-query';
import { ProgramType } from '../pages/common/program/ProgramDetail';
import { programApplicationType } from '../schema';
import axios from '../utils/axios';

export const UseProgramApplicationQueryKey = 'useProgramApplicationQueryKey';

export const useProgramApplicationQuery = (
  programType: ProgramType,
  programId: number,
) => {
  return useQuery({
    queryKey: [UseProgramApplicationQueryKey, programType, programId],
    queryFn: async () => {
      const res = await axios.get(`/${programType}/${programId}/application`);
      return programApplicationType.parse(res.data.data);
    },
    retry: 0,
  });
};

export interface PostApplicationInterface {
  paymentInfo: {
    couponId: number | null;
    priceId: number;
    paymentKey: string;
    orderId: string;
    amount: string;
  };
  contactEmail?: string;
  motivate?: string;
  question?: string;
}

export const usePostApplicationMutation = (
  programId: number,
  programType: ProgramType,
  requestBody: PostApplicationInterface,
  successCallback: () => void,
  errorCallback: (error: Error) => void,
) => {
  // const client = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await axios.post(
        `/application/${programId}?programType=${programType.toUpperCase()}`,
        requestBody,
      );
    },
    onSuccess: (response) => {
      console.log('SUCCESS : ', response);
      successCallback();
      //이 mutation이 성공하면 재로딩되어야 하는 쿼리키 invalidate 처리 후 successCallback
      // client.invalidateQueries(UseUserInfoQueryKey)
      // .then(() => successCallback());
    },
    onError: (error) => errorCallback(error),
  });
};
