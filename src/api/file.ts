import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '../utils/axios';
import invariant from '../utils/invariant';
import { generateRandomString } from '../utils/random';

export type FileType =
  | 'BANNER_MAIN'
  | 'BANNER_PROGRAM'
  | 'BANNER_POPUP'
  | 'CHALLENGE'
  | 'LIVE'
  | 'VOD'
  | 'BLOG';

interface PostFileMutation {
  type: FileType;
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
    onSuccess: async (data) => {
      console.log(data);
      onSuccessCallback && onSuccessCallback(data);
    },
    onError: (error) => {
      console.error(error);
      alert('파일을 전환하는데 실패했습니다.');
      onErrorCallback && onErrorCallback();
    },
  });
};

export async function uploadFile({
  file,
  type,
}: {
  file: File;
  type: FileType;
}) {
  const formData = new FormData();
  formData.append('file', file, `${generateRandomString(10)}_${file.name}`);

  const res = await axios.post('/file', formData, {
    params: { type },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const fileUrl = res?.data?.data?.fileUrl;
  invariant(
    typeof fileUrl === 'string',
    'fileUrl 의 값이 올바르지 않습니다: ' + res.data.data.fileUrl,
  );

  return fileUrl;
}
