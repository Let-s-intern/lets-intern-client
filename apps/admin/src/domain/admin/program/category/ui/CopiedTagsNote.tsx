import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { fetchProgramCategoryIds } from '../programCategoryApi';

/**
 * 챌린지 복제 창의 한 줄: "분류 태그도 함께 복사돼요: 이력서, 포트폴리오".
 * 서버가 복제 때 태그 연결을 그대로 잇는다. 못 읽으면 아무것도 보이지 않는다
 */
const CopiedTagsNote = ({ challengeId }: { challengeId: number }) => {
  const [titles, setTitles] = useState<string[] | null>(null);
  useEffect(() => {
    let alive = true;
    Promise.all([
      fetchProgramCategoryIds('CHALLENGE', challengeId),
      axios.get('/admin/program-category'),
    ])
      .then(([ids, res]) => {
        const groups: { categoryList: { id: number; title: string }[] }[] =
          res.data?.data?.programCategoryGroupList ?? [];
        const titleOf = new Map(
          groups.flatMap((g) =>
            g.categoryList.map((c) => [c.id, c.title] as const),
          ),
        );
        if (alive)
          setTitles(
            ids.flatMap((id) => (titleOf.has(id) ? [titleOf.get(id)!] : [])),
          );
      })
      .catch(() => alive && setTitles(null));
    return () => {
      alive = false;
    };
  }, [challengeId]);

  if (!titles || titles.length === 0) return null;
  return (
    <p className="mb-3 text-xsmall14 text-neutral-30">
      분류 태그도 함께 복사돼요: {titles.join(', ')}
    </p>
  );
};

export default CopiedTagsNote;
