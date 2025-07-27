import { clsx } from 'clsx';

interface MissionGuideRegularSectionProps {
  className?: string;
  todayTh: number;
}

const MissionGuideRegularSection = ({
  className,
  todayTh,
}: MissionGuideRegularSectionProps) => {
  return (
    <div className={clsx('flex flex-col', className)}>
      {/* 제목 및 마감일 섹션 */}
      <section className="mb-3 flex flex-row gap-2">
        <div className="flex flex-row items-center gap-2">
          <h2 className="text-xl font-bold text-neutral-0">
            {todayTh}회차 미션
          </h2>
          <div className="h-[18px] w-px bg-neutral-60" />
          <h2 className="text-xl font-bold text-neutral-0">직무 탐색</h2>
        </div>
        <p className="flex flex-row items-end text-xsmall16 font-semibold text-primary-90">
          마감기한 04.04 11:59까지
        </p>
      </section>

      {/* 미션 가이드 섹션 */}
      <section className="flex flex-col gap-5 rounded-xs border border-neutral-80 px-4 py-4">
        {/* 미션 목록 섹션 */}
        <section className="flex flex-col gap-3">
          <h3 className="text-xsmall16 font-semibold text-neutral-0">
            미션 목록
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <span className="text-xsmall16 font-semibold text-neutral-0">
                1.
              </span>
              <span className="text-xsmall16 text-neutral-0">
                대시보드 사용법 및 미션 인증 방식{' '}
                <span className="font-semibold text-primary">
                  &ldquo;꼭&rdquo;
                </span>{' '}
                확인!
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xsmall16 font-semibold text-neutral-0">
                2.
              </span>
              <span className="text-xsmall16 text-neutral-0">
                마케팅 관심 직무 1개 이상 선정하기
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xsmall16 font-semibold text-neutral-0">
                3.
              </span>
              <span className="text-xsmall16 text-neutral-0">
                각각 인터뷰 3개 이상 정리하기
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xsmall16 font-semibold text-neutral-0">
                4.
              </span>
              <span className="text-xsmall16 text-neutral-0">
                각각 채용공고 5개 이상 정리
              </span>
            </div>
          </div>

          {/* 제출 관련 지침 */}
          <div className="mt-2 flex items-center gap-2">
            <img
              src="/icons/file-notext.svg"
              alt="folder icon"
              className="h-4 w-4"
            />
            <span className="text-xsmall16 text-neutral-0">
              [링크] 제출하기 & [인증샷]과 [소감] 업로드하기
            </span>
          </div>
        </section>

        {/* 추가 콘텐츠 섹션 */}
        <section className="flex flex-col gap-3">
          <p className="text-xsmall16 text-neutral-0">
            추가 콘텐츠에서 160+명의 취업 성공 노하우를 확인해보세요 🎁
          </p>
        </section>

        {/* 분리선 섹션 */}
        <div className="h-px bg-neutral-80" />

        {/* 미션 가이드 섹션 */}
        <section className="flex flex-col gap-3">
          <h3 className="text-xsmall16 font-semibold text-neutral-10">
            미션 가이드
          </h3>
          <p className="text-xsmall16 text-neutral-10">
            내가 막연히 꿈꾸던 마케팅, 정말 잘 알고 있었나 점검해봐요. <br />
            콘텐츠를 따라 직무 인터뷰를 정독하며 여러분이 이해한 방식대로
            정리합시다 😊
          </p>
        </section>

        {/* 미션 자료 모음 섹션 */}
        <section className="flex flex-col gap-4 rounded-xxs bg-neutral-95 p-3 pb-5">
          <div className="flex flex-col">
            <h3 className="text-xsmall16 font-semibold text-neutral-0">
              미션 자료 모음
            </h3>
            <p className="text-xsmall16 text-neutral-10">
              자료를 확인하고 미션을 진행해 주세요.
            </p>
          </div>

          {/* 자료 링크들 */}
          <div className="flex flex-col gap-2">
            <div className="flex cursor-pointer items-center gap-1">
              <img
                src="/icons/file-notext.svg"
                alt="file icon"
                className="h-5 w-5"
              />
              <span className="text-xsmall16 text-primary">미션 템플릿</span>
            </div>
            <div className="flex cursor-pointer items-center gap-1">
              <img
                src="/icons/file-notext.svg"
                alt="file icon"
                className="h-5 w-5"
              />
              <span className="text-xsmall16 text-primary">
                필수 콘텐츠 경험정리_{todayTh}회차
              </span>
            </div>
            <div className="flex cursor-pointer items-center gap-1">
              <img
                src="/icons/file-notext.svg"
                alt="file icon"
                className="h-5 w-5"
              />
              <span className="text-xsmall16 text-primary">
                추가 콘텐츠 경험정리_STAR 서류화
              </span>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default MissionGuideRegularSection;
