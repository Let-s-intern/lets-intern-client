import {
  PassExternalLink,
  PassLandingConfig,
  PassPlan,
} from '@/domain/all-in-one-pass/types';
import VodExposureModal from '@/domain/all-in-one-pass/ui/VodExposureModal';
import dayjs from '@/lib/dayjs';
import { Button, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { lazy, Suspense, useState } from 'react';
import LandingBenefitEditor from './LandingBenefitEditor';
import LandingReviewEditor from './LandingReviewEditor';

const EditorApp = lazy(() => import('@/common/lexical/EditorApp'));

interface Props {
  value: PassLandingConfig;
  plans: PassPlan[];
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
  <section className="flex flex-1 flex-col gap-4">
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
 * 랜딩페이지 구성 (토글). 저장은 landingDescription(JSON).
 *
 * 하드코딩/데이터 자동 노출분(소제목·신뢰지표·혜택 개수·탭 등)은 여기서 받지 않음.
 * 여기엔 운영자가 직접 바꾸는 값만 둠: 히어로 텍스트 · 렉시컬 4개 · 추가혜택 · 후기 ·
 * 최종 CTA. 추가혜택 이름은 외부링크에서 실시간으로 가져옴(저장 시 url 은 제거).
 */
export default function LandingSection({
  value,
  plans,
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

  const [vodModalOpen, setVodModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-10">
      {/* 왼쪽: 히어로·추가혜택·최하단 CTA 세로 스택 / 오른쪽: 후기 */}
      <div className="flex items-start gap-4">
        <div className="flex flex-1 flex-col gap-10">
          {/* 히어로 */}
          <Block title="히어로">
            <div className="flex flex-col gap-3">
              <TextField
                label="헤드라인 (최대 30자)"
                placeholder="예) {패스명} {기간}일 간의 혜택"
                value={value.hero.title}
                onChange={(e) => patchHero({ title: e.target.value })}
                size="small"
                fullWidth
                multiline
                slotProps={{
                  htmlInput: { maxLength: 30 },
                }}
              />
              <TextField
                label="설명 (최대 60자)"
                placeholder="예) 자소서·포트폴리오부터 인적성·면접까지, 취준에 필요한 모든 준비를 하나의 패스로 끝내세요."
                value={value.hero.description}
                onChange={(e) => patchHero({ description: e.target.value })}
                size="small"
                fullWidth
                multiline
                slotProps={{
                  htmlInput: { maxLength: 60 },
                }}
              />
              <TextField
                label="모집 카드 하단 문구 (최대 50자)"
                placeholder="예) 마감 후 다음 기회는 2027 상반기 예정이에요 "
                value={value.hero.recruitFootnote}
                onChange={(e) => patchHero({ recruitFootnote: e.target.value })}
                size="small"
                fullWidth
                multiline
                slotProps={{
                  htmlInput: { maxLength: 50 },
                }}
              />
              <div className="flex flex-col gap-1">
                <DateTimePicker
                  label="노출용 모집 종료일시"
                  value={
                    value.displayDeadline ? dayjs(value.displayDeadline) : null
                  }
                  onChange={(v) =>
                    patch({ displayDeadline: v ? v.toISOString() : null })
                  }
                  format="YYYY.MM.DD HH:mm"
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
                <p className="text-xxsmall12 text-neutral-40">
                  랜딩 페이지 노출용 신청 마감일 설정 필드입니다. 비우면 실제
                  신청 마감일을 따릅니다.
                </p>
              </div>
            </div>
          </Block>

          {/* 최종 CTA */}
          <Block title="최하단 CTA">
            <div className="flex flex-col gap-3">
              <TextField
                label="헤드라인"
                placeholder="예) {패스명}, 지금 바로 시작하세요"
                value={value.finalCta.title}
                onChange={(e) => patchFinalCta({ title: e.target.value })}
                size="small"
                fullWidth
              />
              <TextField
                label="설명"
                placeholder="예) 선착순 마감 전에 합류하고, 취준에 필요한 모든 준비를 한 번에 끝내세요."
                value={value.finalCta.description}
                onChange={(e) => patchFinalCta({ description: e.target.value })}
                size="small"
                fullWidth
              />
            </div>
          </Block>

          {/* 혜택 섹션 카드*/}
          <Block
            title="혜택 요약"
            description="플랜 권한·외부 링크 기준으로 기본값이 채워지며, 아이콘·문구를 자유롭게 수정·추가·삭제할 수 있습니다(최대 6개). 플랜을 바꾼 뒤 기본값을 다시 받으려면 '다시 채우기'를 누르세요. (VOD는 옵션 판매 설정에 따라 자동 노출됩니다.)"
          >
            <LandingBenefitEditor
              plans={plans}
              externalLinks={externalLinks}
              benefits={value.benefitsSummary}
              onChange={(benefitsSummary) => patch({ benefitsSummary })}
            />
          </Block>

          {/* 노출 VOD */}
          <Block
            title="노출 VOD"
            description="VOD 탭에 노출할 3개를 선택해주세요. (선택하지 않으면 자동 선택되어 노출됩니다.)"
          >
            <div className="flex flex-col gap-3">
              {value.vods.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {value.vods.map((vod, i) => (
                    <li
                      key={`${vod.title}-${i}`}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={vod.thumbnail}
                        alt=""
                        className="h-10 w-16 shrink-0 rounded object-cover"
                      />
                      <span className="text-xsmall14 text-neutral-0 line-clamp-1">
                        {vod.title}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <Button
                variant="outlined"
                size="small"
                onClick={() => setVodModalOpen(true)}
                className="self-start"
              >
                {value.vods.length > 0 ? 'VOD 변경' : 'VOD 선택'}
              </Button>
            </div>
          </Block>
        </div>

        {/* 후기 */}
        <Block
          title="후기"
          description="6개 후기가 기본세팅 되어있으며(수정 가능) 최대 9개까지 입력 가능합니다."
        >
          <LandingReviewEditor
            reviews={value.reviews}
            onChange={(reviews) => patch({ reviews })}
          />
        </Block>
      </div>
      {/* 상세 콘텐츠 렉시컬 4개 */}
      <Block
        title="상세 콘텐츠"
        description="랜딩페이지 사이 들어가는 4개 영역입니다."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <LexicalField
            label="1. 인트로(소개 상단)"
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

      <VodExposureModal
        open={vodModalOpen}
        initialVods={value.vods}
        onSave={(vods, vodCount) => patch({ vods, vodCount })}
        onClose={() => setVodModalOpen(false)}
      />
    </div>
  );
}
