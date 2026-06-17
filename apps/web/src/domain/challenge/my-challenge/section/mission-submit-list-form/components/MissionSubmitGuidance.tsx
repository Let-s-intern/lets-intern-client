export const MissionSubmitGuidance = () => {
  return (
    <section>
      <h3 className="text-small18 text-neutral-0 mb-3 font-semibold">
        미션 제출 안내사항
      </h3>
      <div className="rounded-xxs bg-neutral-95 p-3">
        <ul className="text-xsmall14 text-neutral-10">
          <li className="flex items-start">
            <span className="text-neutral-10 mr-2">-</span>
            <span>
              아직 경험을 작성하지 않았거나 삭제, 수정이 필요하다면,{' '}
              <a
                href="/mypage/career/experience"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 underline"
              >
                [커리어 관리 &gt; 경험 정리]
              </a>
              에서 진행해주세요.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-neutral-10 mr-2">-</span>
            <span>
              제출 후, 미션과 소감을 카카오톡으로 공유해야 제출이 인정됩니다.
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
};
