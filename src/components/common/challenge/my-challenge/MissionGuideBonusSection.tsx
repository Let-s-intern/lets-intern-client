import { clsx } from 'clsx';
import MissionHeaderSection from './MissionHeaderSection';

interface MissionGuideBonusSectionProps {
  className?: string;
  todayTh: number;
}

const MissionGuideBonusSection = ({
  className,
  todayTh,
}: MissionGuideBonusSectionProps) => {
  return (
    <div className={clsx('flex flex-col', className)}>
      {/* 제목 및 마감일 섹션 */}
      <MissionHeaderSection
        todayTh={todayTh}
        missionType="블로그 후기 작성하고 리워드 받기!"
        deadline="04.04 11:59"
      />

      {/* 미션 가이드 섹션 */}
      <section className="flex flex-col gap-5 rounded-xs border border-neutral-80 px-4 py-4">
        {/* 인트로 섹션 */}
        <section className="flex flex-col gap-4">
          <p className="text-xsmall16 text-neutral-0">
            여러분의 챌린지 여정을 끝까지 함께해주셔서 감사합니다. <br />
            렛츠커리어는 여러분의 진심 어린 피드백을 기다리고 있어요! <br />
            솔직한 후기를 남겨주시면{' '}
            <span className="font-semibold">
              💰1건당 1만원 리워드를 100%
            </span>{' '}
            지급해드립니다.
          </p>
        </section>

        {/* 참여 방법 섹션 */}
        <section className="flex flex-col gap-3">
          <h3 className="text-xsmall16 font-semibold text-neutral-0">
            참여 방법
          </h3>
          <div className="flex flex-col gap-2 rounded-xxs bg-neutral-95 p-3">
            <div className="flex items-start gap-2">
              <span className="text-xsmall16 font-medium text-neutral-0">
                1. 챌린지를 진행하며 느낀 점, 배운 점, 인상 깊었던 과정을 후기
                형태로 작성해주세요. <br /> 2. 작성한 후기의 링크를 하단의 링크
                입력란에 붙여넣고, [제출하기] 버튼을 눌러주세요! <br />
                3. 매니저가 확인 후 리워드를 지급해드려요!
              </span>
            </div>
          </div>
        </section>

        {/* 분리선 섹션 */}
        <div className="h-px bg-neutral-80" />

        {/* 후기 작성 가이드라인 섹션 */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xsmall16 font-semibold text-neutral-0">
            후기 작성 가이드라인
          </h3>
          <div className="flex flex-col gap-2 rounded-xxs bg-primary-5 p-3">
            <div className="flex items-start gap-2">
              <span className="text-xsmall16 font-medium text-neutral-0">
                - 활동 이미지 3장 이상 필수 첨부 <br />- 필수 키워드 포함 <br />
                - 공개 설정은 전체공개로 해 주세요 <br />- 블로그 플랫폼:
                네이버블로그 / 티스토리 / 브런치 중 택 1
              </span>
            </div>

            {/* 분리선 섹션 */}
            <div className="h-px bg-primary-20" />
            <div className="flex flex-col items-start gap-3">
              <div className="flex flex-col">
                <h4 className="text-xsmall16 font-semibold text-neutral-0">
                  제목
                </h4>
                <span className="text-xsmall16 font-medium text-neutral-0">
                  1. 챌린지를 진행하며 느낀 점, 배운 점, 인상 깊었던 과정을 후기
                  형태로 작성해주세요. <br /> 2. 작성한 후기의 링크를 하단의
                  링크 입력란에 붙여넣고, [제출하기] 버튼을 눌러주세요! <br />
                  3. 매니저가 확인 후 리워드를 지급해드려요!
                </span>
              </div>
              <div className="flex flex-col">
                <h4 className="text-xsmall16 font-semibold text-neutral-0">
                  본문
                </h4>
                <span className="text-xsmall16 font-medium text-neutral-0">
                  &lsquo;렛츠커리어&rsquo;와 &lsquo;취준&rsquo;을 각각 3회 이상
                  언급
                </span>
              </div>
              <div className="flex flex-col">
                <h4 className="text-xsmall16 font-semibold text-neutral-0">
                  해시태그
                </h4>
                <span className="text-xsmall16 font-medium text-neutral-0">
                  #렛츠커리어 #취준 #프로그램명 모두 포함
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 후기 예시 섹션 */}
        <section className="flex flex-col gap-3 font-medium">
          📚 후기 예시가 궁금하다면?
          <div className="flex flex-row items-center gap-2">
            <a
              href="https://www.letscareer.co.kr/review/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xsmall16 text-primary hover:underline"
            >
              👉 후기 모음 보기: https://www.letscareer.co.kr/review/blog
            </a>
          </div>
          여러분의 소중한 경험이 누군가에게는 큰 동기부여가 될 수 있어요.
          <br />
          생생하고 따뜻한 이야기, 기대할게요 😊
        </section>
      </section>
    </div>
  );
};

export default MissionGuideBonusSection;
