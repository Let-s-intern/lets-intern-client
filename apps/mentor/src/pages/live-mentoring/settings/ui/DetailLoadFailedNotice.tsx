/**
 * 상세 스텝 본문을 못 불러왔을 때의 안내.
 *
 * 여기 있던 「개발 중인 페이지입니다 / API 연동 전」 안내를 대체한다(LC-3265).
 * `GET /mentor/live-mentoring/template` 은 실제로 있는 API 다. 실패하는 흔한 이유는
 * 미구현이 아니라 **멘토에게 아직 상품(`live_mentoring`) 행이 없어서** 서버가
 * `LIVE_MENTORING_NOT_FOUND` 404 를 내는 것이다. 상품은 오픈 설정에서 저장하면
 * 만들어지고, 그 스텝이 이제 같은 화면 맨 앞에 있으므로 그리로 보낸다.
 *
 * 그래서 두 경우를 갈라 말한다 — 멘토가 할 일이 다르다.
 */

/** 상품이 아직 없을 때 서버가 내려주는 코드. */
const NOT_FOUND_CODE = 'LIVE_MENTORING_NOT_FOUND';

interface DetailLoadFailedNoticeProps {
  /** 쿼리가 실패시킨 에러. `ApiError` 면 `code` 로 원인을 가른다. */
  error: unknown;
  /** 오픈 설정 스텝으로 옮긴다. */
  onGoToOpenStep: () => void;
}

const DetailLoadFailedNotice = ({
  error,
  onGoToOpenStep,
}: DetailLoadFailedNoticeProps) => {
  const code = (error as { code?: string } | null)?.code;
  const needsProduct = code === NOT_FOUND_CODE;

  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 px-6 py-16 text-center">
      <p className="text-xsmall16 text-neutral-10 font-semibold">
        {needsProduct
          ? '먼저 오픈 설정을 저장해주세요.'
          : '상세 페이지를 불러오지 못했어요.'}
      </p>
      <p className="text-xsmall14 text-neutral-40">
        {needsProduct
          ? '타이틀·타입·진행시간을 저장하면 상세 페이지를 작성할 수 있어요.'
          : '잠시 후 다시 시도해주세요. 계속 같은 화면이면 담당자에게 알려주세요.'}
      </p>
      {needsProduct && (
        <button
          type="button"
          onClick={onGoToOpenStep}
          className="bg-primary hover:bg-primary-hover mt-4 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-colors"
        >
          오픈 설정으로 가기
        </button>
      )}
    </div>
  );
};

export default DetailLoadFailedNotice;
