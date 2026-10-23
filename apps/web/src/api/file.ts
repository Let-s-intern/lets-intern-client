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
  /*
    서버 `FileType.java:27` — LIVE_MENTORING(18, "program/live-mentoring/").
    서버에는 있고 클라에만 없었다. zod enum 이라 타입체크는 통과하고 업로드 직전
    parse 에서 터진다 — 1대1 멘토링 질문의 파일 첨부가 이것 없이는 동작하지 않는다.
  */
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

/**
 * 업로드하고 파일 **id** 를 받는다. 1대1 멘토링 질문 첨부가 이 경로를 쓴다.
 *
 * `uploadFile` 과 같이 **무작위 접두사를 붙여 보낸다.** 서버가 S3 키를
 * `FileType 경로 + 보낸 파일명` 으로 만들기 때문에(`S3Utils.saveFile`), 원본 이름을
 * 그대로 보내면 같은 이름을 올린 다른 사람의 파일을 덮어쓴다. 게다가 저장된 주소는
 * 서명도 만료도 없는 공개 주소라, 이름을 아는 것이 곧 남의 파일을 여는 것이 된다.
 */
export async function uploadFileForId({
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

  return res.data.data.fileId as number;
}
