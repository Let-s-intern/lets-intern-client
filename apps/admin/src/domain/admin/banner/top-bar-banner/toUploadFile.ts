// 서버가 원본 파일명 그대로 S3 에 저장한다. 다른 배너와 이름이 겹치면 이미지를 덮어쓰고,
// 한쪽을 지울 때 다른 쪽 이미지까지 사라지므로 이름을 새로 만들어 올린다.
export const toUploadFile = (file: File) => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return new File([file], `${crypto.randomUUID()}.${extension}`, {
    type: file.type,
  });
};
