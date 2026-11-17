import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import axios from '@/utils/axios';
import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
} from '@mui/material';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  programCategoryTargetTypeLabel,
  type ProgramCategoryTarget,
} from '@/domain/admin/program/category/programCategoryApi';

/** 공개 API 응답. 프론트가 받는 그대로 그리려고 어드민 쪽 스키마를 쓰지 않는다 */
interface PublicCategory {
  id: number;
  title: string;
}
interface PublicGroup {
  id: number;
  title: string;
  categoryList: PublicCategory[];
}

const ALL = 'all';

const getData = async <T,>(path: string): Promise<T> => {
  const res = await axios.get(path);
  return res.data.data as T;
};

interface BundleTarget {
  targetType: ProgramCategoryTarget['targetType'];
  targetId: number;
  title: string;
  thumbnail?: string | null;
  categoryIds: number[];
  mergedTargetIds?: number[];
}

interface ProgramCategoryPreviewPageProps {
  /**
   * true 면 여러 카테고리 조회 API(/program-category/targets?categoryIds=) 를 한 번만 부른다.
   * false 면 카테고리마다 /{id}/targets 를 따로 부르고 화면에서 합친다
   */
  bundle?: boolean;
  /** bundle 일 때 챌린지를 기수와 관계없이 구분별 하나로 합친다 (groupChallenges=true) */
  groupChallenges?: boolean;
}

/**
 * 노출 분류 미리보기. 어드민 설정이 공개 API 로 그대로 내려오는지,
 * 실제 프론트 필터처럼 그려서 확인한다. GET 만 부른다
 */
const ProgramCategoryPreviewPage = ({
  bundle = false,
  groupChallenges = false,
}: ProgramCategoryPreviewPageProps) => {
  const [groupId, setGroupId] = useState<string>(ALL);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [showRaw, setShowRaw] = useState(false);

  const groupPath =
    groupId === ALL
      ? '/program-category'
      : `/program-category/group/${groupId}`;

  // 목록 고르기용. 항상 전체를 받는다
  const { data: allGroups = [] } = useQuery({
    queryKey: ['devTestProgramCategoryAll'],
    queryFn: async () =>
      (
        await getData<{ programCategoryGroupList: PublicGroup[] }>(
          '/program-category',
        )
      ).programCategoryGroupList,
  });

  const groupQuery = useQuery({
    queryKey: ['devTestProgramCategoryGroup', groupPath],
    queryFn: async () =>
      groupId === ALL
        ? (
            await getData<{ programCategoryGroupList: PublicGroup[] }>(
              groupPath,
            )
          ).programCategoryGroupList
        : [await getData<PublicGroup>(groupPath)],
  });
  const groups = groupQuery.data ?? [];

  // 아무것도 고르지 않으면 실제 목록처럼 불러온 노출 목록의 상품을 전부 보여 준다
  const allCategoryIds = groups.flatMap((g) => g.categoryList.map((c) => c.id));
  const queriedIds = checkedIds.length > 0 ? checkedIds : allCategoryIds;

  // 한 번 호출: 고른 것이 없으면 categoryIds 를 비워 서버가 전체를 주게 한다
  const bundleParams = [
    checkedIds.length > 0 ? `categoryIds=${checkedIds.join(',')}` : null,
    groupChallenges ? 'groupChallenges=true' : null,
  ].filter(Boolean);
  const bundlePath = `/program-category/targets${
    bundleParams.length > 0 ? `?${bundleParams.join('&')}` : ''
  }`;
  const bundleQuery = useQuery({
    queryKey: ['devTestProgramCategoryBundle', bundlePath],
    queryFn: async () =>
      (await getData<{ targetList: BundleTarget[] }>(bundlePath)).targetList,
    enabled: bundle,
  });

  const targetQueries = useQueries({
    queries: (bundle ? [] : queriedIds).map((id) => ({
      queryKey: ['devTestProgramCategoryTargets', id],
      queryFn: async () =>
        (
          await getData<{ targetList: ProgramCategoryTarget[] }>(
            `/program-category/${id}/targets`,
          )
        ).targetList,
    })),
  });

  // 여러 카테고리에 걸린 상품은 한 번만 보이고, 어느 카테고리로 걸렸는지 붙인다
  const categoryTitle = (id: number) =>
    groups.flatMap((g) => g.categoryList).find((c) => c.id === id)?.title ??
    String(id);
  const merged = new Map<
    string,
    { target: ProgramCategoryTarget; categoryIds: number[] }
  >();
  // 기수를 합친 챌린지가 무엇을 합쳤는지 카드에 보여 준다
  const mergedIdsByKey = new Map<string, number[]>();
  bundleQuery.data?.forEach(({ categoryIds, mergedTargetIds, ...target }) => {
    const key = `${target.targetType}-${target.targetId}`;
    merged.set(key, { target: { ...target, mappingId: 0 }, categoryIds });
    if (mergedTargetIds) mergedIdsByKey.set(key, mergedTargetIds);
  });
  targetQueries.forEach((query, index) => {
    query.data?.forEach((target) => {
      const key = `${target.targetType}-${target.targetId}`;
      const entry = merged.get(key) ?? { target, categoryIds: [] };
      entry.categoryIds.push(queriedIds[index]);
      merged.set(key, entry);
    });
  });

  const toggle = (id: number) =>
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );

  const calledPaths = [
    `GET /api/v1${groupPath}`,
    ...(bundle
      ? [`GET /api/v1${bundlePath}`]
      : queriedIds.map((id) => `GET /api/v1/program-category/${id}/targets`)),
  ];
  const isTargetLoading = bundle
    ? bundleQuery.isLoading
    : targetQueries.some((q) => q.isLoading);

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>
          {groupChallenges
            ? '노출 분류 미리보기 (챌린지 기수 합치기)'
            : bundle
              ? '노출 분류 미리보기 (한 번 호출)'
              : '노출 분류 미리보기'}
        </Heading>
      </Header>
      <p className="mt-2 text-xsmall14 text-neutral-40">
        공개 API 만 불러 실제 프론트 필터처럼 그립니다. 숨긴 목록·카테고리와
        지워진 상품은 빠지는 것이 정상입니다.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-xsmall14 font-semibold">불러올 노출 목록</span>
        <Select
          size="small"
          value={groupId}
          onChange={(e) => {
            setGroupId(e.target.value);
            setCheckedIds([]);
          }}
          sx={{ minWidth: 220 }}
        >
          <MenuItem value={ALL}>전체 (노출 분류 전체 API)</MenuItem>
          {allGroups.map((group) => (
            <MenuItem key={group.id} value={String(group.id)}>
              {group.title} (목록 하나 API)
            </MenuItem>
          ))}
        </Select>
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={showRaw}
              onChange={(e) => setShowRaw(e.target.checked)}
            />
          }
          label="응답 원본 보기"
        />
      </div>

      <div className="mt-3 rounded-xs bg-neutral-95 p-3 font-mono text-xs text-neutral-10">
        {calledPaths.map((path) => (
          <p key={path}>{path}</p>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-[260px_1fr] gap-6">
        <aside className="rounded-sm border border-neutral-80 p-4">
          <p className="mb-3 text-xsmall14 font-semibold text-neutral-40">
            필터 (프론트 모양)
          </p>
          {groupQuery.isError && (
            <p className="text-xsmall14 text-red-500">
              불러오지 못했습니다. 숨긴 목록이면 404 가 정상입니다.
            </p>
          )}
          {groups.length === 0 && !groupQuery.isError && (
            <p className="text-xsmall14 text-neutral-40">
              보이는 노출 목록이 없습니다.
            </p>
          )}
          {groups.map((group) => (
            <div key={group.id} className="mb-4">
              <p className="font-semibold text-neutral-0">{group.title}</p>
              <div className="flex flex-col">
                {group.categoryList.map((category) => (
                  <FormControlLabel
                    key={category.id}
                    control={
                      <Checkbox
                        size="small"
                        checked={checkedIds.includes(category.id)}
                        onChange={() => toggle(category.id)}
                      />
                    }
                    label={category.title}
                  />
                ))}
                {group.categoryList.length === 0 && (
                  <span className="text-xsmall14 text-neutral-40">
                    카테고리 없음
                  </span>
                )}
              </div>
            </div>
          ))}
        </aside>

        <section className="rounded-sm border border-neutral-80 p-4">
          <p className="mb-4 text-xsmall14 font-semibold text-neutral-40">
            {checkedIds.length > 0
              ? `고른 카테고리의 상품 ${merged.size}개`
              : `전체 ${merged.size}개 (카테고리를 고르면 좁혀집니다)`}
          </p>
          {merged.size === 0 ? (
            <p className="py-16 text-center text-xsmall14 text-neutral-40">
              {isTargetLoading
                ? '불러오는 중…'
                : '연결된 상품이 없습니다. 각 상품 수정 화면의 노출 분류에서 체크하세요.'}
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-3 xl:grid-cols-4">
              {[...merged.values()].map(({ target, categoryIds }) => (
                <li
                  key={`${target.targetType}-${target.targetId}`}
                  className="flex flex-col gap-2"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-xs bg-neutral-95">
                    {target.thumbnail ? (
                      <img
                        src={target.thumbnail}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xsmall14 text-neutral-50">
                        썸네일 없음
                      </div>
                    )}
                  </div>
                  <span className="w-fit rounded-xs bg-primary-10 px-1.5 py-0.5 text-xs font-semibold text-primary">
                    {programCategoryTargetTypeLabel[target.targetType]}
                  </span>
                  <p className="line-clamp-2 text-xsmall16 font-semibold text-neutral-0">
                    {target.title}
                  </p>
                  <p className="text-xs text-neutral-40">
                    {categoryIds.map(categoryTitle).join(' · ')} · #
                    {target.targetId}
                  </p>
                  {(mergedIdsByKey.get(
                    `${target.targetType}-${target.targetId}`,
                  )?.length ?? 0) > 1 && (
                    <p className="text-xs font-semibold text-primary">
                      기수{' '}
                      {
                        mergedIdsByKey.get(
                          `${target.targetType}-${target.targetId}`,
                        )?.length
                      }
                      개 합침 (#
                      {mergedIdsByKey
                        .get(`${target.targetType}-${target.targetId}`)
                        ?.join(', #')}
                      ) → 대표 #{target.targetId}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {showRaw && (
        <pre className="mt-6 max-h-[480px] overflow-auto rounded-xs bg-neutral-95 p-3 text-xs text-neutral-10">
          {JSON.stringify(
            {
              [groupPath]: groupQuery.data,
              ...(bundle ? { [bundlePath]: bundleQuery.data } : {}),
              ...Object.fromEntries(
                queriedIds.map((id, index) => [
                  `/program-category/${id}/targets`,
                  targetQueries[index]?.data,
                ]),
              ),
            },
            null,
            2,
          )}
        </pre>
      )}
    </div>
  );
};

export default ProgramCategoryPreviewPage;
