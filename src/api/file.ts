import { z } from 'zod';
import axios from '../utils/axios';
import invariant from '../utils/invariant';
import { generateRandomString } from '../utils/random';

export const fileType = z.enum([
  'BANNER_MAIN',
  'BANNER_PROGRAM',
  'BANNER_POPUP',
  'CHALLENGE',
  'LIVE',
  'VOD',
  'BLOG',
  'REPORT',
  'BLOG_BANNER',
  'CURATION_ITEM',
]);

export type FileType = z.infer<typeof fileType>;

export async function uploadFile({
  file,
  type,
  name,
}: {
  file: File;
  type: FileType;
  name?: string;
}) {
  const formData = new FormData();
  formData.append(
    'file',
    file,
    name ?? `${generateRandomString(10)}_${file.name}`,
  );

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
