import MainTitle from '../ui/MainTitle';

const PLAN_LABELS = ['베이직 플랜', '스탠다드 플랜', '프리미엄 플랜'] as const;

const COLUMNS = [
  '1회차',
  '2회차',
  '3회차',
  '4회차',
  '5회차',
  '6회차',
  '7회차',
  '8회차',
  '챌린지 종료',
];

// 열: w-20 + gap-[30px],헤더 pl-[120px]
const COL_STEP = 110;
const HEADER_PL = 114;

// 행: 실제 행 높이 + gap-[60px]
const ROW_HEIGHT = 24;
const ROW_GAP = 60;
const ROW_SLOT = ROW_HEIGHT + ROW_GAP;
const BOX_PADDING_Y = 45;
const BASIC_LINE_WIDTH = HEADER_PL + 7 * COL_STEP + 40 - 44;

const TIMELINE_BOXES = [
  {
    colIndex: 2,
    rowStart: 2,
    rowEnd: 2,
    lines: ['1차 현직자', '피드백', '경험 정리 피드백'],
    bgColor: '#A6AAFA',
  },
  {
    colIndex: 3,
    rowStart: 0,
    rowEnd: 2,
    lines: ['서류 컨셉 잡기!', '① 이력서 완성!'],
    bgColor: '#EDEEFE',
  },
  {
    colIndex: 6,
    rowStart: 0,
    rowEnd: 2,
    lines: ['② 자소서 완성!', '③ 포트폴리오', '완성!'],
    bgColor: '#EDEEFE',
  },
  {
    colIndex: 7,
    rowStart: 0,
    rowEnd: 2,
    lines: ['학습 콘텐츠로', '서류 점검', '→ 마스터', '서류 완성!'],
    bgColor: '#EDEEFE',
  },
  {
    colIndex: 8,
    rowStart: 1,
    rowEnd: 2,
    lines: ['2차 현직자', '피드백', '서류 피드백'],
    bgColor: '#CACCFC',
  },
];

// 모바일: 행/열 축이 웹과 반대
// rowIndex: COLUMNS 인덱스 (0=1회차 ... 8=챌린지 종료)
// colStart/colEnd: PLAN_LABELS 인덱스 (0=베이직, 1=스탠다드, 2=프리미엄)
const MOBILE_TIMELINE_BOXES = [
  {
    rowIndex: 2,
    colStart: 2,
    colEnd: 2,
    lines: ['1차 현직자 피드백', '경험 정리 피드백'],
    bgColor: '#A6AAFA',
  },
  {
    rowIndex: 3,
    colStart: 0,
    colEnd: 2,
    lines: ['서류 컨셉 잡기!', '① 이력서 완성!'],
    bgColor: '#EDEEFE',
  },
  {
    rowIndex: 6,
    colStart: 0,
    colEnd: 2,
    lines: ['② 자소서 완성!', '③ 포트폴리오 완성!'],
    bgColor: '#EDEEFE',
  },
  {
    rowIndex: 7,
    colStart: 0,
    colEnd: 2,
    lines: ['학습 콘텐츠로 서류 점검', '→ 마스터 서류 완성!'],
    bgColor: '#EDEEFE',
  },
  {
    rowIndex: 8,
    colStart: 1,
    colEnd: 2,
    lines: ['2차 현직자 피드백', '서류 피드백'],
    bgColor: '#CACCFC',
  },
];

const getBoxStyle = (box: (typeof TIMELINE_BOXES)[number]) => ({
  backgroundColor: box.bgColor,
  left: HEADER_PL + box.colIndex * COL_STEP,
  top: box.rowStart * ROW_SLOT + ROW_HEIGHT / 2 - BOX_PADDING_Y,
  height: (box.rowEnd - box.rowStart) * ROW_SLOT + BOX_PADDING_Y * 2,
});

const MarketingTimelineSection = () => {
  return (
    <section className="flex flex-col items-center px-5 pb-[160px] pt-[60px] md:px-0 md:pb-[190px] md:pt-[100px]">
      <div className="flex w-full max-w-[1140px] flex-col items-center gap-[60px] md:gap-20">
        <div className="flex flex-col items-center gap-6">
          <img
            src="/icons/folder-icon-marketing.svg"
            alt="marketing-timeline"
          />
          <MainTitle className="text-center">
            <span>서류 완성 & 피드백 진행 타임라인!</span>
          </MainTitle>
        </div>
        {/* 데스크탑 레이아웃 */}
        <div className="hidden w-full overflow-x-auto md:block">
          <div className="flex w-full min-w-[1140px] flex-col items-center gap-[70px] pb-10 pl-5 text-neutral-35">
            <div className="flex w-full gap-[30px] pl-[120px] pr-5 text-xsmall16 font-semibold tracking-[-0.1px]">
              {COLUMNS.map((col) => (
                <span key={col} className="w-20 text-center">
                  {col}
                </span>
              ))}
            </div>

            <div className="relative flex w-full flex-col gap-[60px]">
              {PLAN_LABELS.map((label, index) => (
                <div
                  key={label}
                  className="flex w-full items-center gap-[43px]"
                >
                  <span className="w-[87px] text-start text-xsmall16 font-semibold tracking-[-0.1px]">
                    {label}
                  </span>
                  <div
                    className="flex items-center gap-1"
                    style={{
                      width: index === 0 ? BASIC_LINE_WIDTH : undefined,
                      flex: index === 0 ? 'none' : 1,
                    }}
                  >
                    <hr className="flex-1 border-t border-dashed border-neutral-0" />
                    <div className="h-1 w-1 rounded-full bg-neutral-0" />
                  </div>
                </div>
              ))}
              {TIMELINE_BOXES.map((box, i) => (
                <div
                  key={i}
                  className="absolute flex w-[104px] flex-col items-center justify-center rounded-sm px-1.5 text-center text-xsmall14 font-semibold leading-snug tracking-[-0.2px] text-[#27272D]"
                  style={getBoxStyle(box)}
                >
                  {box.lines.map((line, j) => (
                    <span key={j}>{line}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 모바일 레이아웃 */}
        <div
          className="grid w-full text-neutral-35 md:hidden"
          style={{
            gridTemplateColumns: '48px 1fr 1fr 1fr',
            gridTemplateRows: `auto repeat(${COLUMNS.length}, minmax(56px, auto))`,
          }}
        >
          <div style={{ gridColumn: 1, gridRow: 1 }} />
          {PLAN_LABELS.map((label, i) => (
            <span
              key={label}
              className="pb-3 text-center text-xxsmall12 font-semibold tracking-[-0.3px]"
              style={{ gridColumn: i + 2, gridRow: 1 }}
            >
              {label}
            </span>
          ))}

          {COLUMNS.map((col, rowIdx) => (
            <span
              key={`label-${rowIdx}`}
              className="flex max-w-7 items-start justify-center break-keep text-center text-xxsmall12 font-semibold tracking-[-0.3px]"
              style={{ gridColumn: 1, gridRow: rowIdx + 2 }}
            >
              {col}
            </span>
          ))}

          {PLAN_LABELS.map((_, colIdx) => (
            <div
              key={`line-${colIdx}`}
              className="flex flex-col items-center"
              style={{
                gridColumn: colIdx + 2,
                gridRow: `2 / ${colIdx === 0 ? 10 : COLUMNS.length + 2}`,
                zIndex: 1,
              }}
            >
              <div className="w-0 flex-1 border-l border-dashed border-neutral-0" />
              <div className="h-1 w-1 flex-shrink-0 rounded-full bg-neutral-0" />
            </div>
          ))}

          {/* 박스 */}
          {MOBILE_TIMELINE_BOXES.map((box, i) => (
            <div
              key={i}
              className="z-10 -mt-4 flex flex-col items-center justify-center self-start rounded-sm px-1 py-2 text-center text-xxsmall12 font-semibold tracking-[-0.3px] text-[#27272D]"
              style={{
                gridColumn: `${box.colStart + 2} / ${box.colEnd + 3}`,
                gridRow: box.rowIndex + 2,
                backgroundColor: box.bgColor,
              }}
            >
              {box.lines.map((line, j) => (
                <span key={j}>{line}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketingTimelineSection;
