import { useEffect, useState } from 'react';
import {
  putProgramCategoriesOfProgram,
  useProgramCategoryIdsQuery,
  type ProgramCategoryProgramType,
} from './programCategoryApi';

/** 수정 화면의 카테고리 체크 상태. 페이지 저장 때 save 를 함께 부른다 */
export const useProgramCategoryAssign = (
  programType: ProgramCategoryProgramType,
  programId: number,
) => {
  const { data } = useProgramCategoryIdsQuery(programType, programId);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (data) setSelectedIds(data);
  }, [data]);

  const toggle = (id: number) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );

  // 지정 목록을 받기 전에 저장하면 빈 목록으로 덮어써 기존 지정이 지워진다. 받은 뒤에만 보낸다
  const save = async () => {
    if (!data) return;
    await putProgramCategoriesOfProgram({
      programType,
      programId,
      programCategoryIdList: selectedIds,
    });
  };

  return { selectedIds, toggle, save };
};
