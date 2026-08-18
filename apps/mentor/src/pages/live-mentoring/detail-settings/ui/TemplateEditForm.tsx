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
            description="상세 페이지에 표시할 멘토링 유형 섹션의 제목과 문구를 작성해 주세요."
          />
          <p className="mb-4 text-xs text-gray-500">
            멘티가 고민에 맞는 유형을 고를 수 있도록 안내합니다.
          </p>

          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass} htmlFor="typesTitle">
                섹션 제목
              </label>
              <input
                id="typesTitle"
                className={inputClass}
                value={mentoringTypes.title}
                onChange={(e) =>
                  onChange({
                    mentoringTypes: {
                      ...mentoringTypes,
                      title: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="typesSubtitle">
                섹션 설명
              </label>
              <input
                id="typesSubtitle"
                className={inputClass}
                value={mentoringTypes.subtitle}
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

            <ListField<TemplateMentoringType>
              label="유형 카드"
              items={mentoringTypes.items}
              makeEmpty={() => ({
                typeName: '',
                title: '',
                description: '',
                tags: [],
              })}
              renderItem={(item, update) => (
                <div className="flex flex-col gap-2">
                  <input
                    className={inputClass}
                    value={item.typeName}
                    placeholder="유형명 (예: 자기소개서 피드백)"
                    onChange={(e) =>
                      update({ ...item, typeName: e.target.value })
                    }
                  />
                  <textarea
                    rows={2}
                    className={inputClass}
                    value={item.title}
                    placeholder="카드 제목 (줄바꿈 가능)"
                    onChange={(e) => update({ ...item, title: e.target.value })}
                  />
                  <textarea
                    rows={2}
                    className={inputClass}
                    value={item.description}
                    placeholder="설명"
                    onChange={(e) =>
                      update({ ...item, description: e.target.value })
                    }
                  />
                  <input
                    className={inputClass}
                    value={item.tags.join(', ')}
                    placeholder="태그 (쉼표로 구분)"
                    onChange={(e) =>
                      update({
                        ...item,
                        tags: e.target.value
                          .split(',')
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>
              )}
              onChange={(items) =>
                onChange({ mentoringTypes: { ...mentoringTypes, items } })
              }
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
            <input
              className={inputClass}
              value={video.title}
              placeholder="섹션 제목"
              onChange={(e) =>
                onChange({ video: { ...video, title: e.target.value } })
              }
            />
            <input
              className={inputClass}
              value={video.subtitle}
              placeholder="섹션 설명"
              onChange={(e) =>
                onChange({ video: { ...video, subtitle: e.target.value } })
              }
            />
            <div>
              <label className={labelClass} htmlFor="videoUrl">
                유튜브 영상 주소
              </label>
              <input
                id="videoUrl"
                className={inputClass}
                value={video.videoUrl ?? ''}
                placeholder="https://youtu.be/... 또는 https://www.youtube.com/watch?v=..."
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
                <p className="mt-1 text-xs text-gray-400">
                  유튜브 주소를 그대로 붙여넣으면 됩니다. 임베드 주소로 자동
                  변환돼요.
                </p>
              )}
            </div>
            <input
              className={inputClass}
              value={video.caption}
              placeholder="영상 하단 문구"
              onChange={(e) =>
                onChange({ video: { ...video, caption: e.target.value } })
              }
            />
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

          <div className="flex flex-col gap-4">
            <input
              className={inputClass}
              value={results.title}
              placeholder="섹션 제목"
              onChange={(e) =>
                onChange({ results: { ...results, title: e.target.value } })
              }
            />

            <ListField<TemplateResultCase>
              label="Before / After"
              items={results.cases}
              makeEmpty={() => ({
                beforeImage: null,
                afterImage: null,
                beforeCaption: '',
                afterCaption: '',
              })}
              renderItem={(item, update) => (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <ImageField
                      label="Before 이미지"
                      value={item.beforeImage}
                      onChange={(beforeImage) =>
                        update({ ...item, beforeImage })
                      }
                    />
                    <input
                      className={inputClass}
                      value={item.beforeCaption}
                      placeholder="Before 설명"
                      onChange={(e) =>
                        update({ ...item, beforeCaption: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <ImageField
                      label="After 이미지"
                      value={item.afterImage}
                      onChange={(afterImage) => update({ ...item, afterImage })}
                    />
                    <input
                      className={inputClass}
                      value={item.afterCaption}
                      placeholder="After 설명"
                      onChange={(e) =>
                        update({ ...item, afterCaption: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
              onChange={(cases) => onChange({ results: { ...results, cases } })}
            />
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default TemplateEditForm;
