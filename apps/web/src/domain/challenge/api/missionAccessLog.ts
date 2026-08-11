import axios from '@/utils/axios';

interface LogMissionAccessParams {
  challengeId?: number | null;
  missionId?: number | null;
}

/**
 * 미션 열람 기록 (LC-3201).
 *
 * `POST /api/v1/access-log/mission`
 *
 * 미션 상세 조회(`GET /challenge/{challengeId}/missions/{missionId}`)에 기록이
 * 붙어 있었는데, 미션 목록이 각 항목을 그리면서 그 조회를 미리 부른다. 그래서
 * **사용자가 펼치지 않은 미션까지 한꺼번에 이용으로 잡혔다.** 목록만 열고 나간
 * 사람이 미션 20건 이용으로 남으면 환불 판단의 근거가 되지 못한다.
 *
 * 기준은 화면이 데이터를 가져왔는지가 아니라 **사용자가 눌렀는지**다. 그래서
 * 펼침 동작에 이 호출을 붙인다.
 *
 * 발사 후 잊는다(fire-and-forget). 반환 타입을 void 로 둬서 호출부가 응답을
 * 기다리도록 작성할 수 없게 막는다. 기록을 await 하면 펼침이 그만큼 늦어지고,
 * 기록이 실패하면 열리지 않는다.
 */
export const logMissionAccess = ({
  challengeId,
  missionId,
}: LogMissionAccessParams): void => {
  // 어느 챌린지의 어느 미션인지 모르는 기록은 환불 분쟁에서 증빙이 되지 않는다.
  if (!challengeId || !missionId) {
    return;
  }

  axios
    .post('/access-log/mission', { challengeId, missionId })
    // 기록 실패가 unhandled rejection 으로 새어나가지 않도록 반드시 삼킨다.
    // 기록에 실패해도 사용자는 미션을 볼 수 있어야 한다.
    .catch((error) => console.error('logMissionAccess >>', error));
};
