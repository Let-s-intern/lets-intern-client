import {
  PassExternalLink,
  PassLandingConfig,
} from '@/domain/all-in-one-pass/types';
import { TextField } from '@mui/material';
import { lazy, Suspense } from 'react';
import LandingBenefitEditor from './LandingBenefitEditor';
import LandingReviewEditor from './LandingReviewEditor';

const EditorApp = lazy(() => import('@/common/lexical/EditorApp'));

interface Props {
  value: PassLandingConfig;
  externalLinks: PassExternalLink[];
  onChange: (value: PassLandingConfig) => void;
}

/** 랜딩 섹션 공통 소제목 */
const Block = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col gap-4">
    <div className="flex flex-col gap-0.5">
      <h2 className="text-small20 text-neutral-0 font-semibold">{title}</h2>
      {description && (
        <p className="text-xxsmall12 text-neutral-40">{description}</p>
      )}
    </div>
    {children}
  </section>
);

/** 렉시컬 한 개 (라벨 + 에디터) */
const LexicalField = ({
  label,
  initialContent,
  onChange,
}: {
  label: string;
  initialContent: string;
  onChange: (json: string) => void;
}) => (
  <div className="flex flex-col">
    <span className="text-xsmall16 text-neutral-0 font-medium">{label}</span>
    {/* 높이 고정 + 큰 이미지는 보기에만 너비에 맞춰 축소(저장 원본 크기는 유지) */}
    <div className="[&_.editor-scroller]:h-[360px] [&_.editor-scroller_img]:!h-auto [&_.editor-scroller_img]:!w-auto [&_.editor-scroller_img]:!max-w-full">
      <Suspense fallback={null}>
        <EditorApp
          initialEditorStateJsonString={initialContent || undefined}
          onChange={onChange}
        />
      </Suspense>
    </div>
  </div>
);

/**
 * 1.5 랜딩페이지 구성 (토글). 저장은 landingDescription(JSON).
 *
 * 하드코딩/데이터 자동 노출분(소제목·신뢰지표·혜택 개수·탭 등)은 여기서 받지 않는다.
 * 여기엔 운영자가 직접 바꾸는 값만 둔다: 히어로 텍스트 · 렉시컬 4개 · 추가혜택 · 후기 ·
 * 최종 CTA. 추가혜택 이름은 외부링크에서 실시간으로 온다(저장 시 url 은 제거).
 */
export default function LandingSection({
  value,
  externalLinks,
  onChange,
}: Props) {
  const patch = (partial: Partial<PassLandingConfig>) =>
    onChange({ ...value, ...partial });
  const patchHero = (partial: Partial<PassLandingConfig['hero']>) =>
    patch({ hero: { ...value.hero, ...partial } });
  const patchLexical = (partial: Partial<PassLandingConfig['lexical']>) =>
    patch({ lexical: { ...value.lexical, ...partial } });
  const patchFinalCta = (partial: Partial<PassLandingConfig['finalCta']>) =>
    patch({ finalCta: { ...value.finalCta, ...partial } });

  return (
    <div className="flex flex-col gap-10">
      {/* 히어로 */}
      <Block title="히어로">
        <div className="flex flex-col gap-4">
          <TextField
            label="제목"
            placeholder="히어로 제목 (최대 30자)"
            value={value.hero.title}
            onChange={(e) => patchHero({ title: e.target.value })}
            size="small"
            fullWidth
            slotProps={{ htmlInput: { maxLength: 30 } }}
            helperText={`${value.hero.title.length}/30`}
          />
          <TextField
            label="설명"
            placeholder="히어로 설명 (최대 60자)"
            value={value.hero.description}
            onChange={(e) => patchHero({ description: e.target.value })}
            size="small"
            fullWidth
            slotProps={{ htmlInput: { maxLength: 60 } }}
            helperText={`${value.hero.description.length}/60`}
          />
          <TextField
            label="모집 카드 하단 문구"
            placeholder="예) 마감 후 다음 기회는 2027 상반기 예정이에요 (최대 50자)"
            value={value.hero.recruitFootnote}
            onChange={(e) => patchHero({ recruitFootnote: e.target.value })}
            size="small"
            fullWidth
            slotProps={{ htmlInput: { maxLength: 50 } }}
            helperText={`${value.hero.recruitFootnote.length}/50`}
          />
        </div>
      </Block>

      {/* 상세 콘텐츠 렉시컬 4개 */}
      <Block
        title="상세 콘텐츠"
        description="랜딩페이지 사이 들어가는 4개 영역입니다."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <LexicalField
            label="1. 인트로(최상단)"
            initialContent={value.lexical.introSection}
            onChange={(introSection) => patchLexical({ introSection })}
          />
          <LexicalField
            label="2. 플레이북(혜택섹션 상단)"
            initialContent={value.lexical.playbookSection}
            onChange={(playbookSection) => patchLexical({ playbookSection })}
          />
          <LexicalField
            label="3. 특별혜택(혜택섹션 하단)"
            initialContent={value.lexical.benefitSection}
            onChange={(benefitSection) => patchLexical({ benefitSection })}
          />
          <LexicalField
            label="4. 기타후기(후기섹션 하단)"
            initialContent={value.lexical.reviewSection}
            onChange={(reviewSection) => patchLexical({ reviewSection })}
          />
        </div>
      </Block>

      {/* 추가 혜택 */}
      <LandingBenefitEditor
        externalLinks={externalLinks}
        benefitExtras={value.benefitExtras}
        manualBenefits={value.manualBenefits}
        onBenefitExtrasChange={(benefitExtras) => patch({ benefitExtras })}
        onManualBenefitsChange={(manualBenefits) => patch({ manualBenefits })}
      />

      {/* 후기 */}
      <LandingReviewEditor
        reviews={value.reviews}
        onChange={(reviews) => patch({ reviews })}
      />

      {/* 최종 CTA */}
      <Block title="최종 CTA">
        <div className="flex flex-col gap-4">
          <TextField
            label="제목"
            value={value.finalCta.title}
            onChange={(e) => patchFinalCta({ title: e.target.value })}
            size="small"
            fullWidth
          />
          <TextField
            label="설명"
            value={value.finalCta.description}
            onChange={(e) => patchFinalCta({ description: e.target.value })}
            size="small"
            fullWidth
          />
        </div>
      </Block>
    </div>
  );
}
