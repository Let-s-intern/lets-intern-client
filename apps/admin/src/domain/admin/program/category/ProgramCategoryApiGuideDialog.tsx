import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import type { ProgramCategoryGroup } from './programCategoryApi';

interface ApiGuide {
  path: string;
  summary: string;
  response: string;
}

const API_GUIDES: ApiGuide[] = [
  {
    path: 'GET /api/v1/program-category',
    summary:
      '노출 분류 전체. 숨기지 않은 노출 목록과 그 안의 카테고리를 순서대로 줍니다. 필터를 통째로 그릴 때 씁니다.',
    response: `{
  "programCategoryGroupList": [
    {
      "id": 1, "title": "관심 직무", "sortOrder": 0, "isVisible": true,
      "categoryList": [
        { "id": 3, "title": "마케팅", "sortOrder": 0, "isVisible": true, "programCount": 4 }
      ]
    }
  ]
}`,
  },
  {
    path: 'GET /api/v1/program-category/group/{노출 목록 id}',
    summary:
      '노출 목록 하나. 한 페이지가 특정 목록만 쓸 때 부릅니다. 숨긴 목록이면 404 입니다.',
    response: `{
  "id": 1, "title": "관심 직무", "sortOrder": 0, "isVisible": true,
  "categoryList": [ { "id": 3, "title": "마케팅", ... } ]
}`,
  },
  {
    path: 'GET /api/v1/program-category/{카테고리 id}/targets',
    summary:
      '카테고리에 연결된 상품. 유형·id·제목을 연결한 순서대로 줍니다. 서류별 랜딩처럼 카테고리 하나의 상품을 보여줄 때 씁니다. 숨긴 카테고리면 404, 지워진 상품은 빠집니다.',
    response: `{
  "targetList": [
    { "mappingId": 12, "targetType": "CHALLENGE", "targetId": 442, "title": "이력서 1주 완성 챌린지" },
    { "mappingId": 13, "targetType": "BLOG", "targetId": 87, "title": "이력서 쓰는 법" }
  ]
}`,
  },
  {
    path: 'GET /api/v1/program-category/targets?categoryIds=1,2,3',
    summary:
      '여러 카테고리의 상품을 한 번에. 같은 상품은 한 번만 오고, 걸린 카테고리 id 가 categoryIds 로 붙습니다. categoryIds 를 비우면 보이는 카테고리 전체입니다. 필터에서 여러 개를 고르거나 "전체" 를 그릴 때는 카테고리마다 부르지 말고 이것을 씁니다. groupChallenges=true 를 붙이면 챌린지를 기수와 관계없이 구분별 대표 기수 하나로 합치고, 합친 원래 id 를 mergedTargetIds 로 줍니다. 여러 개를 고를 때 match=GROUP 이면 같은 노출 목록 안은 하나라도, 목록끼리는 전부 걸린 상품만 줍니다(필터). ALL 은 전부, ANY(기본)는 하나라도입니다.',
    response: `{
  "targetList": [
    { "targetType": "CHALLENGE", "targetId": 442, "title": "이력서 1주 완성 챌린지", "thumbnail": "https://...", "categoryIds": [3, 7] }
  ]
}`,
  },
];

const TARGET_TYPES =
  'CHALLENGE 챌린지 · LIVE · VOD · GUIDEBOOK 가이드북 · LIVE_MENTORING 1:1 LIVE 멘토링 · MEMBERSHIP 올인원 패스 · BLOG 블로그';

interface ProgramCategoryApiGuideDialogProps {
  open: boolean;
  onClose: () => void;
  groups: ProgramCategoryGroup[];
}

/** 프론트가 노출 분류를 어떻게 불러 쓰는지 설명한다. 지금 데이터의 id 도 같이 보여 준다 */
const ProgramCategoryApiGuideDialog = ({
  open,
  onClose,
  groups,
}: ProgramCategoryApiGuideDialogProps) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>노출 분류 API</DialogTitle>
    <DialogContent>
      <p className="mb-4 text-xsmall14 text-neutral-40">
        모두 로그인 없이 부를 수 있는 공개 API 입니다. 응답은 공통 형식의 data
        안에 들어 있습니다. 어드민에서 바꾸면 배포 없이 바로 반영됩니다.
      </p>

      <div className="flex flex-col gap-5">
        {API_GUIDES.map((guide) => (
          <section key={guide.path}>
            <code className="rounded-xs bg-neutral-95 px-2 py-1 text-xsmall14 font-semibold text-neutral-0">
              {guide.path}
            </code>
            <p className="mt-2 text-xsmall14 text-neutral-10">
              {guide.summary}
            </p>
            <pre className="mt-2 overflow-x-auto rounded-xs bg-neutral-95 p-3 text-xs text-neutral-10">
              {guide.response}
            </pre>
          </section>
        ))}
      </div>

      <p className="mt-5 text-xsmall14 text-neutral-10">
        <span className="font-semibold">targetType 값</span> — {TARGET_TYPES}
      </p>

      <section className="mt-5">
        <p className="text-xsmall14 font-semibold text-neutral-0">
          지금 등록된 id
        </p>
        {groups.length === 0 ? (
          <p className="mt-1 text-xsmall14 text-neutral-40">
            아직 노출 목록이 없습니다.
          </p>
        ) : (
          <ul className="mt-1 flex flex-col gap-1 text-xsmall14 text-neutral-10">
            {groups.map((group) => (
              <li key={group.id}>
                <span className="font-semibold">
                  {group.title} (목록 id {group.id})
                </span>
                {!group.isVisible && ' · 숨김'}
                {group.categoryList.length > 0 && ' — '}
                {group.categoryList
                  .map(
                    (category) =>
                      `${category.title} ${category.id}${category.isVisible ? '' : '(숨김)'}`,
                  )
                  .join(', ')}
              </li>
            ))}
          </ul>
        )}
      </section>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>닫기</Button>
    </DialogActions>
  </Dialog>
);

export default ProgramCategoryApiGuideDialog;
