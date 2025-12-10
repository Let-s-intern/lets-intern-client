export const MissionSubmitGuidance = () => {
  return (
    <section>
      <h3 className="mb-3 text-small18 font-semibold text-neutral-0">
        미션 제출 안내사항
      </h3>
      <div className="rounded-xxs bg-neutral-95 p-3">
        <ul className="text-xsmall14 text-neutral-10">
          <li className="flex items-start">
            <span className="mr-2 text-neutral-10">-</span>
            <span>
              미션 시작일 이후 작성하거나 수정한 경험만 제출할 수 있어요.
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-neutral-10">-</span>
            <span>
              아직 경험을 작성하지 않았거나 삭제, 수정이 필요하다면,{' '}
              <a
                href="/mypage/career/experience"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80"
              >
                [커리어 관리 &gt; 경험 정리]
              </a>
              에서 진행해주세요.
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-neutral-10">-</span>
            <span>
              제출 후, 미션과 소감을 카카오톡으로 공유해야 제출이 인정됩니다.
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
};
