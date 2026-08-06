import axios from '@/utils/axios';

/**
 * 미션 자료의 종류.
 *
 * 템플릿을 받은 것과 추가 콘텐츠를 본 것은 이용의 성격이 다르다. 지금 화면에서
 * 구분해 쓰지 않더라도 남겨 두면 나중에 쓸 수 있고, 안 남기면 소급이 불가능하다.
 * 필수와 추가를 뭉뚱그려 보내지 않는다 — 구분이 목적이다.
 */
export type MissionContentType = 'TEMPLATE' | 'ESSENTIAL' | 'ADDITIONAL';

interface LogMissionContentAccessParams {
  challengeId?: number | null;
  missionId?: number | null;
  /**
   * ESSENTIAL·ADDITIONAL 만 값이 있다. 템플릿은 `missionInfo.templateLink` 라는
   * 미션의 단일 필드라 콘텐츠 엔티티 id 자체가 없다.
   * 값이 없으면 바디에서 생략한다 — 0 이나 임의값을 채우면 존재하지 않는 대상을
   * 가리키는 숫자가 되어 증빙이 오염된다.
   */
  contentId?: number | null;
  contentType: MissionContentType;
}

interface MissionContentAccessLogBody {
  challengeId: number;
  missionId: number;
  contentType: MissionContentType;
  contentId?: number;
}

/**
 * 미션 자료 열람 기록 (LC-3201).
 *
 * `POST /api/v1/access-log/mission-content`
 *
 * 미션 자료 링크는 `window.open` 으로 새 탭을 열 뿐이라 서버를 거치지 않는다.
 * 조회 API 에 얹는 방식으로는 잡히지 않아 예외적으로 프론트가 기록을 요청한다.
 *
 * 경로와 바디가 아직 BE 확정 전이다. 요청 생성을 이 함수 하나에 가둬 두었으니
 * 스펙이 바뀌면 호출부가 아니라 여기만 고친다.
 *
 * 발사 후 잊는다(fire-and-forget). 반환 타입을 void 로 둬서 호출부가 응답을
 * 기다리도록 작성할 수 없게 막는다. 기록을 await 하면 그 뒤의 `window.open` 이
 * 사용자 제스처 컨텍스트를 잃어 팝업 차단에 걸린다.
 */
export const logMissionContentAccess = ({
  challengeId,
  missionId,
  contentId,
  contentType,
}: LogMissionContentAccessParams): void => {
  // 어느 미션의 자료인지 모르는 기록은 환불 분쟁에서 증빙이 되지 않는다. 보내지 않는다.
  if (!challengeId || !missionId) {
    return;
  }

  const body: MissionContentAccessLogBody = {
    challengeId,
    missionId,
    contentType,
  };

  // 없는 id 를 임의값으로 채우지 않고 키 자체를 생략한다.
  if (contentId !== null && contentId !== undefined) {
    body.contentId = contentId;
  }

  axios
    .post('/access-log/mission-content', body)
    // 기록 실패가 unhandled rejection 으로 새어나가지 않도록 반드시 삼킨다.
    // 기록에 실패해도 사용자는 자료를 볼 수 있어야 한다.
    .catch((error) => console.error('logMissionContentAccess >>', error));
};
