import type { LiveMentoringTemplate } from '@/api/live-mentoring/liveMentoringSchema';

interface TemplatePreviewProps {
  template: LiveMentoringTemplate;
  /** 헤드라인에 들어갈 멘토 닉네임 (오픈 설정에서 참조). */
  nickname: string;
}

const sectionLabel = 'text-center text-xs font-medium text-gray-500';
const sectionTitle = 'text-center text-base font-bold text-gray-900';

/** 노출 off 인 섹션 자리에 "빠집니다"를 알려주는 자리표시. */
const HiddenNotice = ({ id, name }: { id: string; name: string }) => (
  <div
    id={id}
    className="rounded-lg border border-dashed border-gray-300 py-6 text-center text-xs text-gray-400"
  >
    {name} 섹션은 노출 안 함 상태입니다 — 상세 페이지에서 제외됩니다.
  </div>
);

/**
 * 상세 페이지 실시간 미리보기.
 *
 * 멘티가 보는 공개 상세(`apps/web/.../detail/LiveMentoringDetailPage.tsx`)의
 * 섹션 구성·순서·문구 규칙을 그대로 따른다. 폭이 좁은 사이드 패널이라 레이아웃은
 * 1열로 눕히되, **무엇이 어떤 문구로 나가는지**는 실제와 같아야 한다.
 * 미리보기가 실제와 다르면 멘토가 잘못된 기대로 오픈하게 된다.
 */
const TemplatePreview = ({ template, nickname }: TemplatePreviewProps) => {
  const { hero, intro, mentoringTypes, strategy, video, results } = template;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
      <h2 className="mb-4 text-base font-semibold text-gray-900">미리보기</h2>

      <div className="flex flex-col gap-8 rounded-lg bg-gray-50 p-4">
        {/* 시안 0 · 히어로 */}
        <div
          id="preview-section-hero"
          className="bg-neutral-0 -m-4 mb-0 flex flex-col gap-2 rounded-t-lg p-4 text-white"
        >
          <div className="flex items-center gap-1">
            <span className="bg-primary rounded px-1.5 py-0.5 text-[10px] font-bold">
              BEST
            </span>
            <span className="bg-primary-20 text-primary-dark rounded px-1.5 py-0.5 text-[10px] font-semibold">
              선착순 마감
            </span>
          </div>
          <p className="text-sm font-bold leading-snug">
            {nickname} 멘토의 1:1 멘토링
          </p>
          <ul className="flex flex-col gap-0.5">
            {hero.bullets.map((bullet, i) => (
              <li key={i} className="text-[11px] text-white/80">
                - {bullet}
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-white/50">
            상품명·가격·진행 기간은 오픈 설정 값이 들어갑니다.
          </p>
        </div>

        {/* 시안 1 · 멘토 소개 */}
        <div className="flex flex-col gap-3">
          <p className={sectionLabel}>멘토 소개</p>
          <p className={sectionTitle}>
            {intro.passedCount !== null
              ? `확실한 전략으로 ${intro.passedCount.toLocaleString('ko-KR')}명을 합격시킨 ${nickname} 멘토가 함께해요`
              : `${nickname} 멘토가 함께해요`}
          </p>

          {intro.profileImage && (
            <img
              src={intro.profileImage}
              alt=""
              className="aspect-[4/5] w-full rounded-lg object-cover"
            />
          )}

          <p className="text-sm font-bold text-gray-900">{nickname}</p>
          {intro.affiliation && (
            <p className="text-xs font-semibold text-gray-700">
              {intro.affiliation}
            </p>
          )}
          {intro.careerLines.length > 0 && (
            <ul className="flex flex-col gap-1">
              {intro.careerLines.map((line, i) => (
                <li key={i} className="text-xs text-gray-600">
                  {line}
                </li>
              ))}
            </ul>
          )}
          {intro.oneLiner && (
            <div className="bg-primary-5 rounded-lg p-3">
              <p className="text-primary mb-1 text-xs font-semibold">
                💬 멘토님의 한마디
              </p>
              <p className="whitespace-pre-wrap text-xs text-gray-600">
                {intro.oneLiner}
              </p>
            </div>
          )}
        </div>

        {/* 시안 2 · 멘토링 유형 */}
        <div id="preview-section-mentoringTypes" className="flex flex-col gap-3">
          <p className={sectionLabel}>멘토링 유형</p>
          <p className={sectionTitle}>{mentoringTypes.title}</p>
          <p className="text-center text-xs text-gray-500">
            {mentoringTypes.subtitle}
          </p>
          <ul className="flex flex-col gap-2">
            {mentoringTypes.items.map((item, i) => (
              <li key={i} className="rounded-lg bg-white p-3">
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="bg-primary rounded px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    멘토링 유형 {i + 1}
                  </span>
                  <span className="text-xs font-medium text-gray-700">
                    {item.typeName}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm font-bold text-gray-900">
                  {item.title}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-xs text-gray-500">
                  {item.description}
                </p>
                {item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500"
                      >
                        # {tag}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* 시안 3 · 취업 성공 전략 */}
        {strategy.visible ? (
          <div id="preview-section-strategy" className="flex flex-col gap-3">
            <p className={sectionTitle}>{strategy.title}</p>
            <p className="text-center text-xs text-gray-500">
              {strategy.subtitle}
            </p>
            <ul className="flex flex-col gap-2">
              {strategy.points.map((point, i) => (
                <li key={i} className="bg-primary-5 rounded-lg p-3">
                  {point.image && (
                    <img
                      src={point.image}
                      alt=""
                      className="mb-2 w-full rounded object-cover"
                    />
                  )}
                  <span className="bg-primary rounded-full px-2 py-0.5 text-[10px] font-semibold text-white">
                    Point {i + 1}
                  </span>
                  <p className="mt-1.5 text-sm font-bold text-gray-900">
                    {point.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {point.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <HiddenNotice id="preview-section-strategy" name="취업 성공 전략" />
        )}

        {/* 시안 4 · 이렇게 도와드려요 (영상) */}
        {video.visible ? (
          <div id="preview-section-video" className="flex flex-col gap-3">
            <p className={sectionTitle}>{video.title}</p>
            <p className="text-center text-xs text-gray-500">
              {video.subtitle}
            </p>
            {video.videoUrl ? (
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
                <iframe
                  src={video.videoUrl}
                  title={video.title}
                  className="h-full w-full"
                  allowFullScreen
                />
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-gray-300 py-6 text-center text-xs text-gray-400">
                영상 URL 을 입력하면 여기에 재생기가 나옵니다.
              </p>
            )}
            {video.caption && (
              <p className="text-center text-xs text-gray-600">
                {video.caption}
              </p>
            )}
          </div>
        ) : (
          <HiddenNotice id="preview-section-video" name="이렇게 도와드려요" />
        )}

        {/* 시안 5 · 결과 사례 */}
        {results.visible ? (
          <div id="preview-section-results" className="flex flex-col gap-3">
            <p className={sectionLabel}>{results.subtitle}</p>
            <p className={sectionTitle}>{results.title}</p>
            <ul className="flex flex-col gap-3">
              {results.cases.map((item, i) => (
                <li key={i} className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="rounded-t bg-gray-200 py-1 text-center text-[10px] font-semibold text-gray-600">
                      Before
                    </span>
                    {item.beforeImage && (
                      <img src={item.beforeImage} alt="" className="rounded" />
                    )}
                    <p className="text-center text-[10px] text-gray-500">
                      {item.beforeCaption}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="bg-primary rounded-t py-1 text-center text-[10px] font-semibold text-white">
                      After
                    </span>
                    {item.afterImage && (
                      <img src={item.afterImage} alt="" className="rounded" />
                    )}
                    <p className="text-center text-[10px] font-medium text-gray-700">
                      ✓ {item.afterCaption}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <HiddenNotice id="preview-section-results" name="결과 사례" />
        )}

        <p className="border-t border-gray-200 pt-4 text-center text-[10px] text-gray-400">
          플랜 · 진행 프로세스 · 후기 · 다른 멘토 · FAQ 섹션은
          <br />
          오픈 설정과 운영 값에서 자동으로 채워집니다.
        </p>
      </div>
    </section>
  );
};

export default TemplatePreview;
