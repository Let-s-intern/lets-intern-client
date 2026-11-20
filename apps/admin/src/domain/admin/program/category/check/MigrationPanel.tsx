import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useState } from 'react';
import {
  programCategoryTargetTypeLabel,
  useMigrateLandings,
  type LandingMigrationReport,
} from '../programCategoryApi';

const STATUS_LABEL = {
  MIGRATED: '옮김',
  SKIPPED_NO_TAG: '같은 주소의 분류가 없어 건너뜀',
  SKIPPED_HAS_SECTIONS: '분류에 섹션이 이미 있어 건너뜀',
} as const;

/** 보고서. dryRun 이면 "이렇게 바뀌어요", 아니면 "바뀌었어요" */
const Report = ({ report }: { report: LandingMigrationReport }) => (
  <div className="flex flex-col gap-4 text-xsmall14">
    {report.pageList.map((p) => (
      <div key={p.slug} className="flex flex-col gap-1">
        <p className="font-semibold text-neutral-0">
          /category/{p.slug}
          <span className="ml-2 font-normal text-neutral-40">
            {p.landingGroupTitle} → {p.tagTitle ?? '분류 없음'} ·{' '}
            {STATUS_LABEL[p.status]}
          </span>
        </p>
        {p.sectionList.length > 0 && (
          <ol className="ml-4 list-decimal text-neutral-20">
            {p.sectionList.map((s, i) => (
              <li key={i}>
                {s.title}
                <span className="text-neutral-40">
                  {' '}
                  ·{' '}
                  {s.targetTypes
                    .map((t) => programCategoryTargetTypeLabel[t])
                    .join('·') || '유형 없음'}
                  {s.visible ? '' : ' · 숨김'}
                  {s.note ? ` · ${s.note}` : ''}
                </span>
              </li>
            ))}
          </ol>
        )}
        {p.newlyInFilterList.length > 0 && (
          <p className="ml-4 text-xxsmall12 text-neutral-40">
            /program 의 &quot;{p.tagTitle}&quot; 버튼에도 새로 보이게 될 상품{' '}
            {p.addedMappingCount}
            개: {p.newlyInFilterList.join(', ')}
          </p>
        )}
      </div>
    ))}
    {(report.missingTagSlugList ?? []).length > 0 && (
      <p className="text-xxsmall12 text-red-500">
        같은 주소의 태그가 없어 옮기지 못한 주소:{' '}
        {report.missingTagSlugList?.join(', ')} · 그 주소로 태그를 만든 뒤 다시
        실행하면 옮겨져요.
      </p>
    )}
    {report.directMappingNote && (
      <p className="text-xxsmall12 text-neutral-40">
        {report.directMappingNote}
      </p>
    )}
    {report.duplicateTagTitleList.length > 0 && (
      <p className="text-xxsmall12 text-neutral-40">
        이름이 겹치는 분류: {report.duplicateTagTitleList.join(', ')} (합치지
        않았어요)
      </p>
    )}
  </div>
);

/**
 * 일회성: 예전 랜딩(노출 목록 + 섹션 카테고리)을 같은 주소의 분류 섹션으로 옮긴다.
 * 먼저 바뀔 내용을 보여 주고, 확인하면 실행한다. 예전 목록은 지우지 않는다
 */
const MigrationPanel = ({ legacyCount }: { legacyCount: number }) => {
  const { snackbar } = useAdminSnackbar();
  const migrate = useMigrateLandings();
  const [report, setReport] = useState<LandingMigrationReport | null>(null);

  const run = async (dryRun: boolean) => {
    try {
      setReport(await migrate.mutateAsync(dryRun));
      if (!dryRun) snackbar('옮겼습니다.');
    } catch {
      snackbar('실패했습니다.');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xs bg-neutral-95 px-4 py-3">
      <span className="text-xsmall14 text-neutral-10">
        예전 방식 랜딩 {legacyCount}개가 남아 있어요. 같은 주소의 분류 섹션으로
        옮기면 이 화면에서 고칠 수 있어요.
      </span>
      <Button
        size="small"
        variant="outlined"
        disabled={migrate.isPending}
        onClick={() => run(true)}
      >
        옮길 내용 보기
      </Button>
      {report && (
        <Dialog open onClose={() => setReport(null)} maxWidth="md" fullWidth>
          <DialogTitle>
            {report.dryRun ? '이렇게 옮겨져요 (아직 바뀌지 않음)' : '옮긴 결과'}
          </DialogTitle>
          <DialogContent>
            <Report report={report} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReport(null)}>닫기</Button>
            {report.dryRun && (
              <Button
                variant="contained"
                disabled={migrate.isPending}
                onClick={() => run(false)}
              >
                옮기기 실행
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default MigrationPanel;
