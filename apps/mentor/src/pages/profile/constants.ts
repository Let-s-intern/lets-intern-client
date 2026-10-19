/**
 * 서버 `user.introduction` · `nickname` · `sns` 는 varchar(255) 다.
 * 넘기면 DB 가 UPDATE 를 거절해 저장이 500(INTERNAL_SERVER_ERROR)으로 실패한다.
 */
export const PROFILE_TEXT_MAX_LENGTH = 255;
