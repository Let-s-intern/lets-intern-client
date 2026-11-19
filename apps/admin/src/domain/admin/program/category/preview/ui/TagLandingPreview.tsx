import {
  useProgramCategoryLandingQuery,
  type ProgramCategory,
  type ProgramCategoryGroup,
} from '../../programCategoryApi';
import { siteMenuOf } from '../../utils/tagUtils';
import LandingPreview, { type PreviewHighlight } from './LandingPreview';

/** 분류 랜딩을 사이트와 같은 공개 API 로 받아 그린다. 저장된 설정 기준이다 */
const TagLandingPreview = ({
  tag,
  groups,
  highlight,
}: {
  tag: ProgramCategory;
  groups: ProgramCategoryGroup[];
  highlight?: PreviewHighlight;
}) => {
  const { data, isLoading } = useProgramCategoryLandingQuery(tag.slug);
  if (!tag.slug)
    return (
      <p className="text-xsmall14 text-neutral-40">
        페이지 주소가 없어 랜딩이 없어요. 페이지 설정에서 주소를 정하세요.
      </p>
    );
  if (isLoading)
    return <p className="text-xsmall14 text-neutral-40">불러오는 중…</p>;
  if (!data)
    return (
      <p className="text-xsmall14 text-neutral-40">
        보이는 섹션이 없어 사이트에서는 예전 랜딩(있다면) 또는 &quot;준비
        중&quot; 화면이 보여요.
      </p>
    );
  return (
    <LandingPreview
      slug={tag.slug}
      title={data.page.title}
      heroTitle={data.page.heroTitle}
      heroDescription={data.page.heroDescription}
      menu={siteMenuOf(groups)}
      sections={data.sectionList.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        displayType: s.displayType,
        targets: s.targetList,
      }))}
      highlight={highlight}
    />
  );
};

export default TagLandingPreview;
