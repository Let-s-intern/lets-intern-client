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
  'GUIDEBOOK',
  'BLOG',
  'REPORT',
  'BLOG_BANNER',
  'CURATION_ITEM',
  'BANNER_MAIN_BOTTOM',
  'COMMON_BANNER',
  'USER_PROFILE',
  // 어드민 회사 로고 라이브러리(LC-3498). 서버 `FileType.COMPANY_LOGO("company-logo")`
  'COMPANY_LOGO',
  // 1:1 LIVE 멘토링 썸네일(LC-3508). 서버 `FileType.LIVE_MENTORING("program/live-mentoring/")`
  'LIVE_MENTORING',
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

export async function uploadFileForId({
  file,
  type,
}: {
  file: File;
  type: FileType;
}) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post('/file', formData, {
    params: { type },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data.data.fileId as number;
}
