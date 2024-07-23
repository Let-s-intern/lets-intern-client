import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '../utils/axios';

interface PostFileMutation {
  type: string;
  file: File;
}

export const usePostFileMutation = (
  onSuccessCallback?: (data: AxiosResponse<any, any>) => void,
  onErrorCallback?: () => void,
) => {
  return useMutation({
    mutationFn: async ({ type, file }: PostFileMutation) => {
      const formData = new FormData();
      formData.append('file', file);

      return await axios.post('/file', formData, {
        params: { type },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: (data) => {
      onSuccessCallback && onSuccessCallback(data);
    },
    onError: (error) => {
      console.error(error);
      alert('파일을 전환하는데 실패했습니다.');
      onErrorCallback && onErrorCallback();
    },
  });
};
