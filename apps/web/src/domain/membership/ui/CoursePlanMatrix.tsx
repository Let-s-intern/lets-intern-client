import { useRef, type CSSProperties } from 'react';
import {
  CATEGORIES,
  COURSE_TAG_LABEL,
  MATRIX_CELL_MAP,
  matrixCellKey,
  type Category,
  type MatrixCell,
  type Owner,
  type CourseTag,
  STEPS,
  type Step,
} from '../data/coursePlan';
import CarouselDots from './CarouselDots';
import { useCarouselDots } from '@letscareer/hooks';

// 렛츠커리어가 직접 함께하는 챌린지 셀인지. (셀 색 강조용)
/**
 * 범례를 두 갈래로 나눈다 (시안 8).
 * 앞은 패스에 들어 있는 자료, 뒤는 렛츠커리어가 직접 함께하는 단계다.
 * 태그를 더하면 여기 배열에도 넣어야 범례에 나온다.
 */
const MATERIAL_TAGS: CourseTag[] = ['free', 'template', 'checklist', 'vod'];
const LETSCAREER_TAGS: CourseTag[] = ['challenge', 'live', 'mentoring'];

// 무료 자료·템플릿·체크리스트(자료 제공) 셀은 강조 없이 흰 배경으로 둔다.
const isProvided = (owner: Owner) =>
  owner === 'challenge' || owner === 'challenge-deep';

// 한 STEP 칸의 셀(들). document/step03 처럼 2셀이면 세로로 쌓는다.
// 모든 셀에 분류 배지(무료 자료·템플릿 제공·체크리스트 제공·챌린지)를 단다.
// 셀 색은 owner 기준(data-owner/data-provided)으로 그대로 유지한다.
function StepColumn({ cells }: { cells: MatrixCell[] }) {
  return (
    <div className="cpm-col">
      {cells.map((cell) => (
        <article
          key={cell.owner + cell.title}
          className="cpm-cell"
          data-owner={cell.owner}
          // 셀 배경을 태그별로 달리 칠하려면 여기에도 태그가 있어야 한다
          data-tag={cell.tag}
          data-provided={isProvided(cell.owner) ? 'true' : undefined}
        >
          <span className="cpm-cell-tag" data-tag={cell.tag}>
            {COURSE_TAG_LABEL[cell.tag]}
          </span>
          <p className="cpm-cell-title">{cell.title}</p>
          <p className="cpm-cell-desc">
            {cell.desc}
            {/*
              일정은 nowrap 한 덩어리로 붙인다. 한 문자열로 두면 좁은 셀에서
              "10.8 목" / "20:00" 으로 갈려 다른 날 일정처럼 읽힌다.
            */}
            {cell.when && (
              <>
                {' · '}
                <span className="cpm-cell-when">{cell.when}</span>
              </>
            )}
          </p>
        </article>
      ))}
    </div>
  );
}

// 데스크탑 STEP 헤더 행. 준비/실전 구간을 phase 로 색 안내.
function StepHeader() {
  return (
    <div className="cpm-steps" aria-hidden="true">
      <div className="cpm-steps-corner" />
      {STEPS.map((step, i) => (
        <div
          className="cpm-step"
          data-phase={step.phase}
          style={{ '--i': i } as CSSProperties}
          key={step.id}
        >
          <span className="cpm-step-no">STEP {step.no}</span>
          <span className="cpm-step-label">{step.label}</span>
          {/* 주차·날짜 — 시안 8. 단계명만으로는 언제 하는 일인지 알 수 없다. */}
          <span className="cpm-step-range">{step.range}</span>
        </div>
      ))}
    </div>
  );
}

// 카테고리 한 줄(=행). 데스크탑은 [카테고리 라벨 | STEP01..05] 그리드,
// 모바일은 카테고리 카드로 자연 분해되며 STEP 칸이 세로로 쌓인다.
function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="cpm-row">
      <div className="cpm-cat">
        <span className="cpm-cat-label">{category.label}</span>
        <span className="cpm-cat-hint">{category.hint}</span>
      </div>
      <div className="cpm-cells">
        {STEPS.map((step: Step) => {
          const cells =
            MATRIX_CELL_MAP.get(matrixCellKey(step.id, category.id)) ?? [];
          return (
            <div
              className="cpm-step-cell"
              data-phase={step.phase}
              key={step.id}
            >
              <span className="cpm-step-tag" data-phase={step.phase}>
                STEP {step.no}
              </span>
              <StepColumn cells={cells} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CoursePlanMatrix() {
  // 모바일에서 .cpm-body 는 가로 scroll-snap 트랙이 된다(CSS). 도트는
  // 공용 훅이 IntersectionObserver 로 활성 슬라이드를 추적한다.
  const bodyRef = useRef<HTMLDivElement>(null);
  const { activeIndex, scrollToSlide } = useCarouselDots(bodyRef);

  return (
    <div className="cpm">
      <StepHeader />
      <CarouselDots
        count={CATEGORIES.length}
        activeIndex={activeIndex}
        onSelect={scrollToSlide}
        label="카테고리 넘기기"
        itemLabel={(i) => CATEGORIES[i].label}
      />
      <div className="cpm-body" ref={bodyRef}>
        {CATEGORIES.map((category) => (
          <CategoryRow category={category} key={category.id} />
        ))}
      </div>
      {/*
        범례는 COURSE_TAG_LABEL 에서 만든다. 예전에는 배지 4종을 여기 직접 적어 뒀는데,
        태그를 7종으로 늘렸을 때 표에는 새 배지가 뜨고 범례에는 안 떠서 어긋났다.
        한 곳에서 만들면 태그를 더해도 범례가 자동으로 따라온다.
      */}
      <p className="cpm-note">
        {MATERIAL_TAGS.map((tag) => (
          <span className="cpm-note-chip" data-tag={tag} key={tag}>
            {COURSE_TAG_LABEL[tag]}
          </span>
        ))}
        는 패스에 포함된 자료,{' '}
        {LETSCAREER_TAGS.map((tag) => (
          <span className="cpm-note-chip" data-tag={tag} key={tag}>
            {COURSE_TAG_LABEL[tag]}
          </span>
        ))}
        은 렛츠커리어가 직접 함께하는 단계예요.
      </p>
    </div>
  );
}
