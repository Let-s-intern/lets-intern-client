import type { FocusEvent } from 'react';

import type {
  LiveMentoringTemplate,
  TemplateMentoringType,
  TemplateResultCase,
  TemplateStrategyPoint,
} from '@/api/live-mentoring/liveMentoringSchema';
import { toYoutubeEmbedUrl } from '../../constants';
import { DETAIL_TABS, type DetailTabId } from '../tabs';
import DetailSectionHeader from './DetailSectionHeader';
import KeyPointField from './KeyPointField';
import MentorProfileCard from './MentorProfileCard';
import { useMentorHashTagListQuery } from '@/api/mentor-hash-tag/mentorHashTag';

import MentoringTypeCardField from './MentoringTypeCardField';
import ResultCaseField from './ResultCaseField';
import WritingGuide from './WritingGuide';
import ImageField from './ImageField';
import ListField from './ListField';

interface TemplateEditFormProps {
  template: LiveMentoringTemplate;
  /** 지금 열려 있는 탭. 이 탭의 섹션만 렌더한다. */
  activeTab: DetailTabId;
  onChange: (partial: Partial<LiveMentoringTemplate>) => void;
  /** 입력 포커스가 옮겨간 섹션을 알린다 — 미리보기가 해당 섹션으로 따라 스크롤한다. */
}

const cardClass = 'rounded-xl border border-gray-200 bg-white p-5 md:p-6';
const labelClass = 'mb-1 block text-xs font-medium text-gray-600';
const inputClass =
  'focus:border-primary w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors';

/**
 * 카드 헤더의 번호·이름·필수 여부는 탭 정의에서 가져온다.
 * 두 곳에 따로 적으면 탭 순서를 바꿨을 때 카드 번호만 옛 순서로 남는다.
 */
const sectionMeta = (id: DetailTabId) => {
  const index = DETAIL_TABS.findIndex((tab) => tab.id === id);
  return {
    step: index + 1,
    name: DETAIL_TABS[index].label,
    required: DETAIL_TABS[index].required,
  };
};

/**
 * 노출 토글.
 *
 * 라벨은 상태에 따라 바꾸지 않는다. 예전에는 꺼진 상태에서 "노출 안 함 (섹션 전체 제외)"
 * 으로 글자가 바뀌었는데, 체크박스 옆 문구는 "지금 상태"가 아니라 "체크하면 일어날 일"로도
 * 읽힌다 — 노출시키려던 사람이 오히려 체크를 하지 않게 된다.
 *
 * 그래서 라벨은 "체크 = 노출"로 고정하고, 현재 상태는 배지로 따로 보여준다.
 */
const VisibleToggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) => (
  <label className="flex cursor-pointer items-center gap-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="accent-primary h-4 w-4"
    />
    <span className="text-xs text-gray-600">상세 페이지에 노출</span>
    {!checked && (
      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-500">
        지금은 숨김
      </span>
    )}
  </label>
);

/**
 * 상세 페이지 설정 편집 폼 — 시안 1~5번 섹션만 편집한다.
 *
 * 6~10번(플랜·진행 프로세스·후기 목록·다른 멘토·FAQ)은 오픈 설정 값이나 운영 고정값에서
 * 파생되므로 여기서 다루지 않는다. 후기는 노출 여부만 제어한다.
 *
 * 한 번에 한 탭의 섹션만 렌더한다. 폼 상태는 그대로 상위(페이지)가 들고 있어서
 * 탭을 옮겨도 입력한 값은 남는다 — 렌더에서 빠질 뿐 상태에서 지워지지 않는다.
 */
const TemplateEditForm = ({
  template,
  activeTab,
  onChange,
}: TemplateEditFormProps) => {
  const { hero, intro, mentoringTypes, strategy, video, results } = template;
  /*
   * 태그 목록은 여기서 한 번만 조회해 카드에 내려준다. 카드가 최대 5개라
   * 카드별 조회는 같은 요청을 다섯 번 만든다.
   */
  const { data: hashTags } = useMentorHashTagListQuery();

  // 미리보기 자동 스크롤 — 포커스가 어느 섹션으로 들어왔는지는 캡처 단계에서 한 번에 잡는다.
  const handleFocusCapture = (e: FocusEvent<HTMLDivElement>) => {
    const section = (e.target as HTMLElement)
      .closest<HTMLElement>('[data-section]')
      ?.getAttribute('data-section');
  };

  return (
    <div className="flex flex-col gap-6" onFocusCapture={handleFocusCapture}>
      {/* 시안 0 · 히어로 */}
      {activeTab === 'hero' ? (
        <section className={cardClass} data-section="hero">
          <DetailSectionHeader
            {...sectionMeta('hero')}
            heading="이 멘토링을 간단히 소개해 주세요"
            description="멘토링에서 다루는 내용과 멘티가 받을 수 있는 도움을 짧게 작성해 주세요."
          />
          <KeyPointField
            bullets={hero.bullets}
            onChange={(bullets) => onChange({ hero: { bullets } })}
          />

          <div className="mt-4">
            <WritingGuide
              advice="멘토링 내용(주제, 특징, 강점, 추천 대상 등)이나 받을 수 있는 도움을 한 문장씩 작성해 보세요"
              examples={[
                '이력서, 자기소개서, 포트폴리오 피드백 및 첨삭',
                '다양한 커리어 고민에 대한 자유로운 QNA',
                '사이드 프로젝트 기획, 진행, 성과 만드는 방법',
              ]}
            />
          </div>
        </section>
      ) : null}

      {/*
        시안 2 · 멘토 정보는 여기서 편집하지 않는다.
        프로필 이미지·소속·경력·한마디는 프로필 도메인이 소유하고,
        합격시킨 인원 수는 서버가 집계한다. 두 곳에서 고칠 수 있으면 어느 쪽이
        진짜인지 알 수 없어진다. 저장 요청 DTO에도 `intro` 가 없다.
      */}
      {activeTab === 'intro' ? (
        <section className={cardClass} data-section="intro">
          <DetailSectionHeader
            {...sectionMeta('intro')}
            heading="상세 페이지에 표시될 프로필을 확인해 주세요"
            description="프로필에 등록된 사진과 대표 경력을 사용해요. 수정이 필요하면 프로필에서 변경해 주세요."
          />
          <MentorProfileCard intro={intro} />
        </section>
      ) : null}

      {/* 시안 2 · 멘토링 유형 */}
      {activeTab === 'mentoringTypes' ? (
        <section className={cardClass} data-section="mentoringTypes">
          <DetailSectionHeader
            {...sectionMeta('mentoringTypes')}
            heading="멘토링 유형에 대해 알려주세요"
            description={
              '상세 페이지 최상단에 표시할 멘토링 유형에 대한 섹션 제목을 작성해 주세요.\n멘토링으로 멘티에게 어떤 도움을 줄 수 있는지 간략하게 적으면 좋아요.'
            }
          />

          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xsmall14 text-neutral-10 font-semibold">
                상단 유형 소개 문구
              </p>

              <div className="mt-3 flex flex-col gap-3">
                <div>
                  <label className={labelClass} htmlFor="typesTitle">
                    멘토링 유형 소개 제목{' '}
                    <span className="text-system-error">*</span>
                  </label>
                  <div className="border-neutral-80 focus-within:border-primary flex items-center gap-2 rounded-md border bg-white px-3 py-2.5 transition-colors">
                    <input
                      id="typesTitle"
                      value={mentoringTypes.title}
                      maxLength={20}
                      placeholder="레이블"
                      className="text-xsmall14 text-neutral-10 placeholder:text-neutral-60 min-w-0 flex-1 outline-none"
                      onChange={(e) =>
                        onChange({
                          mentoringTypes: {
                            ...mentoringTypes,
                            title: e.target.value,
                          },
                        })
                      }
                    />
                    <span className="shrink-0 text-xs text-neutral-50">
                      {mentoringTypes.title.length}/20
                    </span>
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor="typesSubtitle">
                    멘토링 유형 소개 문구
                  </label>
                  <textarea
                    id="typesSubtitle"
                    rows={4}
                    value={mentoringTypes.subtitle}
                    placeholder="레이블"
                    className="border-neutral-80 focus:border-primary text-xsmall14 text-neutral-10 placeholder:text-neutral-60 w-full resize-none rounded-md border bg-white px-3 py-2.5 outline-none transition-colors"
                    onChange={(e) =>
                      onChange({
                        mentoringTypes: {
                          ...mentoringTypes,
                          subtitle: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="mt-3">
                <WritingGuide
                  advice="멘티가 받을 수 있는 도움을 간략하고 명확하게 표현하면 좋아요."
                  examples={[]}
                  labeledExamples={[
                    {
                      label: '멘토링 유형 소개 제목',
                      value:
                        '쥬디 멘토에게는 자소서, 포트폴리오 도움을 받을 수 있어요',
                    },
                    {
                      label: '멘토링 유형 소개 문구',
                      value:
                        '현재 고민에 맞는 멘토링 유형을 살펴보고 도움을 요청해보세요',
                    },
                  ]}
                />
              </div>
            </div>

            <MentoringTypeCardField
              items={mentoringTypes.items}
              hashTags={hashTags ?? []}
              onChange={(items) =>
                onChange({ mentoringTypes: { ...mentoringTypes, items } })
              }
            />

            <WritingGuide
              advice="유형별로 어떤 고민에 적합하고, 멘토링으로 어떤 도움을 받을 수 있는지 구체적으로 작성해 주세요"
              examples={[]}
              labeledExamples={[
                { label: '유형 선택', value: '포트폴리오 피드백' },
                {
                  label: '유형 제목',
                  value:
                    '포트폴리오에서 핵심 역량이 잘 드러나는지 점검받고 싶다면',
                },
                {
                  label: '부가 설명',
                  value:
                    '프로젝트의 핵심 역량과 문제 해결 과정이 잘 드러나도록 포트폴리오 구성을 점검할 수 있어요.',
                },
                {
                  label: '관련 태그',
                  value: '#구성 점검  #역량 강조  #프로젝트 정리',
                },
              ]}
            />
          </div>
        </section>
      ) : null}

      {/* 시안 3 · 취업 성공 전략 */}
      {activeTab === 'strategy' ? (
        <section className={cardClass} data-section="strategy">
          <DetailSectionHeader
            {...sectionMeta('strategy')}
            heading="취업 성공 전략을 소개해 주세요"
            description="멘토링에서 알려줄 전략을 Point 로 나눠 보여줄 수 있어요."
            action={
              <VisibleToggle
                checked={strategy.visible}
                onChange={(visible) =>
                  onChange({ strategy: { ...strategy, visible } })
                }
              />
            }
          />

          <div className="flex flex-col gap-4">
            <input
              className={inputClass}
              value={strategy.title}
              placeholder="섹션 제목"
              onChange={(e) =>
                onChange({ strategy: { ...strategy, title: e.target.value } })
              }
            />
            <input
              className={inputClass}
              value={strategy.subtitle}
              placeholder="섹션 설명"
              onChange={(e) =>
                onChange({
                  strategy: { ...strategy, subtitle: e.target.value },
                })
              }
            />

            <ListField<TemplateStrategyPoint>
              label="Point"
              items={strategy.points}
              makeEmpty={() => ({ image: null, title: '', description: '' })}
              renderItem={(point, update) => (
                <div className="flex flex-col gap-2">
                  <ImageField
                    label="이미지"
                    value={point.image}
                    onChange={(image) => update({ ...point, image })}
                  />
                  <input
                    className={inputClass}
                    value={point.title}
                    placeholder="Point 제목"
                    onChange={(e) =>
                      update({ ...point, title: e.target.value })
                    }
                  />
                  <textarea
                    rows={3}
                    className={inputClass}
                    value={point.description}
                    placeholder="설명"
                    onChange={(e) =>
                      update({ ...point, description: e.target.value })
                    }
                  />
                </div>
              )}
              onChange={(points) =>
                onChange({ strategy: { ...strategy, points } })
              }
            />
          </div>
        </section>
      ) : null}

      {/* 시안 4 · 이렇게 도와드려요 (영상) */}
      {activeTab === 'video' ? (
        <section className={cardClass} data-section="video">
          <DetailSectionHeader
            {...sectionMeta('video')}
            heading="멘토링 소개 영상을 등록해 주세요"
            description="멘토링 방식이나 제공하는 도움을 소개하는 영상을 등록할 수 있어요."
            action={
              <VisibleToggle
                checked={video.visible}
                onChange={(visible) =>
                  onChange({ video: { ...video, visible } })
                }
              />
            }
          />
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass} htmlFor="videoTitle">
                영상 제목
              </label>
              <div className="border-neutral-80 focus-within:border-primary flex items-center gap-2 rounded-md border bg-white px-3 py-2.5 transition-colors">
                <input
                  id="videoTitle"
                  value={video.title}
                  maxLength={20}
                  placeholder="예: 멘토는 이렇게 도와드려요"
                  className="text-xsmall14 text-neutral-10 placeholder:text-neutral-60 min-w-0 flex-1 outline-none"
                  onChange={(e) =>
                    onChange({ video: { ...video, title: e.target.value } })
                  }
                />
                <span className="shrink-0 text-xs text-neutral-50">
                  {video.title.length}/20
                </span>
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="videoSubtitle">
                영상 설명
              </label>
              <input
                id="videoSubtitle"
                className={inputClass}
                value={video.subtitle}
                placeholder="영상에서 확인할 수 있는 내용을 간단히 소개해 주세요"
                onChange={(e) =>
                  onChange({ video: { ...video, subtitle: e.target.value } })
                }
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="videoUrl">
                YouTube 영상 링크
              </label>
              <input
                id="videoUrl"
                className={inputClass}
                value={video.videoUrl ?? ''}
                placeholder="https://www.youtube.."
                onChange={(e) =>
                  onChange({
                    video: { ...video, videoUrl: e.target.value || null },
                  })
                }
                /*
                 * 붙여넣은 공유 링크를 포커스가 빠질 때 embed 주소로 바꿔 넣는다.
                 * 값을 조용히 바꾸지 않고 입력창에 그대로 보여줘 무엇이 저장될지 드러낸다.
                 */
                onBlur={(e) => {
                  const normalized = toYoutubeEmbedUrl(e.target.value);
                  if (normalized && normalized !== e.target.value) {
                    onChange({ video: { ...video, videoUrl: normalized } });
                  }
                }}
              />
              {video.videoUrl && !toYoutubeEmbedUrl(video.videoUrl) ? (
                <p role="alert" className="text-system-error mt-1 text-xs">
                  YouTube 주소만 넣을 수 있어요. 공유 링크나
                  youtube.com/watch?v=... 형태를 붙여넣으면 자동으로 바뀝니다.
                </p>
              ) : (
                <p className="mt-1 text-xs text-neutral-50">
                  * 공개 또는 일부 공개로 설정된 YouTube 영상 링크를 입력해
                  주세요.
                </p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="videoCaption">
                영상 아래 안내 문구
              </label>
              <input
                id="videoCaption"
                className={inputClass}
                value={video.caption}
                placeholder="영상과 함께 안내할 내용이 있다면 입력해 주세요"
                onChange={(e) =>
                  onChange({ video: { ...video, caption: e.target.value } })
                }
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* 시안 5 · 결과 사례 */}
      {activeTab === 'results' ? (
        <section className={cardClass} data-section="results">
          <DetailSectionHeader
            {...sectionMeta('results')}
            heading="멘토링 후 무엇이 달라졌나요?"
            description="멘티가 기대할 수 있는 변화를 구체적인 전후 사례의 이미지와 설명으로 보여주세요."
            action={
              <VisibleToggle
                checked={results.visible}
                onChange={(visible) =>
                  onChange({ results: { ...results, visible } })
                }
              />
            }
          />

          <div className="flex flex-col gap-5">
            <div>
              <label className={labelClass} htmlFor="resultsTitle">
                결과 사례 제목
              </label>
              <div className="border-neutral-80 focus-within:border-primary flex items-center gap-2 rounded-md border bg-white px-3 py-2.5 transition-colors">
                <input
                  id="resultsTitle"
                  value={results.title}
                  maxLength={20}
                  placeholder="예: 멘토링 후 이렇게 달라졌어요"
                  className="text-xsmall14 text-neutral-10 placeholder:text-neutral-60 min-w-0 flex-1 outline-none"
                  onChange={(e) =>
                    onChange({ results: { ...results, title: e.target.value } })
                  }
                />
                <span className="shrink-0 text-xs text-neutral-50">
                  {results.title.length}/20
                </span>
              </div>
            </div>

            <ResultCaseField
              cases={results.cases}
              onChange={(cases) => onChange({ results: { ...results, cases } })}
            />
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default TemplateEditForm;
