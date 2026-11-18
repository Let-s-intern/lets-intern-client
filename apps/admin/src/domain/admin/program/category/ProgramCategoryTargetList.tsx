import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  programCategoryTargetTypeLabel,
  useDeleteProgramCategoryMapping,
  useProgramCategoryTargetsQuery,
  type ProgramCategoryTarget,
} from './programCategoryApi';

// 1:1 LIVE 멘토링 화면은 멘토 id 로 열려 멘토링 id 로는 바로 갈 수 없다. 목록으로 보낸다
const editPath = ({ targetType, targetId }: ProgramCategoryTarget) => {
  switch (targetType) {
    case 'CHALLENGE':
      return `/challenge/${targetId}/edit`;
    case 'LIVE':
      return `/live/${targetId}/edit`;
    case 'VOD':
      return `/vod/${targetId}/edit`;
    case 'GUIDEBOOK':
      return `/guidebook/${targetId}/edit`;
    case 'MEMBERSHIP':
      return `/all-in-one-pass/${targetId}/edit`;
    case 'BLOG':
      return `/blog/edit/${targetId}`;
    case 'MAGNET':
      return `/magnet/${targetId}/post`;
    case 'LIVE_MENTORING':
      return '/live-mentoring';
  }
};

/** 카테고리에 연결된 상품 목록. 줄마다 수정 화면 링크와 해제 버튼이 있다 */
const ProgramCategoryTargetList = ({ categoryId }: { categoryId: number }) => {
  const { snackbar } = useAdminSnackbar();
  const { data: targets, isLoading } = useProgramCategoryTargetsQuery(
    categoryId,
    true,
  );
  const unlink = useDeleteProgramCategoryMapping();

  const handleUnlink = async (target: ProgramCategoryTarget) => {
    if (unlink.isPending) return;
    try {
      await unlink.mutateAsync(target.mappingId);
    } catch {
      snackbar('해제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <p className="py-2 pl-6 text-xsmall14 text-neutral-40">불러오는 중…</p>
    );
  }
  if (!targets || targets.length === 0) {
    return (
      <p className="py-2 pl-6 text-xsmall14 text-neutral-40">
        연결된 상품이 없습니다. 각 상품 수정 화면의 노출 분류에서 체크하세요.
      </p>
    );
  }

  return (
    <ul className="mb-2 ml-6 flex flex-col border-l-2 border-primary-10 pl-3">
      {targets.map((target) => (
        <li
          key={target.mappingId}
          className="flex items-center gap-2 py-1 text-xsmall14"
        >
          <span className="shrink-0 rounded-xs bg-neutral-95 px-1.5 text-neutral-40">
            {programCategoryTargetTypeLabel[target.targetType]}
          </span>
          {target.title === null ? (
            <span className="truncate text-neutral-40">
              지워진 상품 (#{target.targetId})
            </span>
          ) : (
            <Link
              to={editPath(target)}
              className="truncate text-neutral-10 underline-offset-2 hover:underline"
            >
              {target.title || `제목 없음 (#${target.targetId})`}
            </Link>
          )}
          <Button
            size="small"
            color="error"
            sx={{ ml: 'auto', flexShrink: 0 }}
            disabled={unlink.isPending}
            onClick={() => handleUnlink(target)}
          >
            해제
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default ProgramCategoryTargetList;
