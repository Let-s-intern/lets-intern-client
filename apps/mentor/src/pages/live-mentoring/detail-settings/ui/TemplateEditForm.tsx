import type {
  LiveMentoringTemplate,
  TemplateMentoringType,
  TemplateResultCase,
  TemplateStrategyPoint,
} from '@/api/live-mentoring/liveMentoringSchema';
import { toYoutubeEmbedUrl } from '../../constants';
import ImageField from './ImageField';
import ListField from './ListField';

interface TemplateEditFormProps {
  template: LiveMentoringTemplate;
  onChange: (partial: Partial<LiveMentoringTemplate>) => void;
}

const cardClass = 'rounded-xl border border-gray-200 bg-white p-5 md:p-6';
const titleClass = 'text-base font-semibold text-gray-900';
const labelClass = 'mb-1 block text-xs font-medium text-gray-600';
const inputClass =
  'focus:border-primary w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors';

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
 */
const TemplateEditForm = ({ template, onChange }: TemplateEditFormProps) => {
  const { hero, mentoringTypes, strategy, video, results } = template;

  return (
    <div className="flex flex-col gap-6">
      {/* 시안 0 · 히어로 */}
      <section className={cardClass}>
        <h2 className={titleClass}>히어로 (최상단)</h2>
        <p className="mb-4 mt-1 text-xs text-gray-500">
          상품명·가격·진행 기간은 오픈 설정 값을 그대로 씁니다. 여기서는 제목
          아래 소개 불릿만 편집합니다.
        </p>

        <ListField<string>
          label="소개 불릿"
          items={hero.bullets}
          makeEmpty={() => ''}
          renderItem={(bullet, update) => (
            <input
              className={inputClass}
              value={bullet}
              placeholder="이력서, 자기소개서, 포트폴리오 피드백 및 첨삭"
              onChange={(e) => update(e.target.value)}
            />
          )}
          onChange={(bullets) => onChange({ hero: { bullets } })}
        />
      </section>

      {/*
        시안 1 · 멘토 소개는 여기서 편집하지 않는다.
        프로필 이미지·소속·경력·한마디는 프로필 도메인이 소유하고,
        합격시킨 인원 수는 서버가 집계한다. 두 곳에서 고칠 수 있으면 어느 쪽이
        진짜인지 알 수 없어진다.
      */}
      <section className={cardClass}>
        <h2 className={titleClass}>멘토 소개</h2>
        <p className="mt-1 text-xs text-gray-500">
          프로필 이미지·소속·경력·한마디는{' '}
          <a href="/profile" className="text-primary underline">
            프로필 페이지
          </a>
          에서 수정합니다. 합격시킨 인원 수는 서버에서 자동 집계됩니다.
        </p>
      </section>

      {/* 시안 2 · 멘토링 유형 */}
      <section className={cardClass}>
        <h2 className={titleClass}>멘토링 유형</h2>
        <p className="mb-4 mt-1 text-xs text-gray-500">
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
                  mentoringTypes: { ...mentoringTypes, title: e.target.value },
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

      {/* 시안 3 · 취업 성공 전략 */}
      <section className={cardClass}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className={titleClass}>취업 성공 전략</h2>
          <VisibleToggle
            checked={strategy.visible}
            onChange={(visible) =>
              onChange({ strategy: { ...strategy, visible } })
            }
          />
        </div>

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
              onChange({ strategy: { ...strategy, subtitle: e.target.value } })
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
                  onChange={(e) => update({ ...point, title: e.target.value })}
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

      {/* 시안 4 · 이렇게 도와드려요 (영상) */}
      <section className={cardClass}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className={titleClass}>이렇게 도와드려요 (영상)</h2>
          <VisibleToggle
            checked={video.visible}
            onChange={(visible) => onChange({ video: { ...video, visible } })}
          />
        </div>

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
              영상 임베드 URL
            </label>
            <input
              id="videoUrl"
              className={inputClass}
              value={video.videoUrl ?? ''}
              placeholder="https://www.youtube.com/embed/... 또는 공유 링크"
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
                공유 링크를 붙여넣어도 embed 주소로 자동 변환됩니다.
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

      {/* 시안 5 · 결과 사례 */}
      <section className={cardClass}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className={titleClass}>결과 사례</h2>
          <VisibleToggle
            checked={results.visible}
            onChange={(visible) =>
              onChange({ results: { ...results, visible } })
            }
          />
        </div>

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
                    onChange={(beforeImage) => update({ ...item, beforeImage })}
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
    </div>
  );
};

export default TemplateEditForm;
