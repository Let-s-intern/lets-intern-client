import type { OptionGroupDraft } from '../option/types/optionGroupDraft';
import OptionGroupsPreview from '../option/ui/OptionGroupsPreview';
import { hasVisibleAdditionalPrice } from '../option/utils/optionPreview';
import type { OneTimeFormSettingsValues } from '../types/oneTimeFormSettings';
import ProductCardPreview from './ProductCardPreview';

interface ApplyPreviewAsideProps {
  values: OneTimeFormSettingsValues;
  optionGroups: OptionGroupDraft[];
  applicationCount: number;
}

export const OPTION_CHANGE_NOTICE =
  '신청자가 있는 폼에서 옵션 금액이나 이름을 바꾸면, 이미 받은 신청에는 신청 시점의 이름과 금액이 남는다. 결제된 옵션은 삭제 대신 노출만 끈다.';

/**
 * 오른쪽 신청 화면 미리보기(시안 7절). 저장 전 입력을 그대로 보여 준다.
 * 무료 폼은 신청 화면에 옵션이 나가지 않으므로(U1) 옵션 미리보기도 숨긴다.
 */
const ApplyPreviewAside = ({
  values,
  optionGroups,
  applicationCount,
}: ApplyPreviewAsideProps) => (
  <aside className="sticky top-6 flex w-[22.5rem] flex-none flex-col gap-3">
    <p className="text-xxsmall12 text-neutral-40 font-medium">
      신청 화면 미리보기
    </p>
    <ProductCardPreview
      thumbnailUrl={values.thumbnailUrl}
      categoryText={values.categoryText}
      title={values.title}
      scheduleText={values.scheduleText}
      isPaid={values.isPaid}
      basePrice={values.basePrice}
      hasAdditionalPrice={hasVisibleAdditionalPrice(optionGroups)}
    />
    {values.isPaid ? <OptionGroupsPreview groups={optionGroups} /> : null}
    {applicationCount > 0 ? (
      <p className="text-xxsmall12 text-neutral-40 bg-neutral-95 rounded-md px-4 py-3">
        {OPTION_CHANGE_NOTICE}
      </p>
    ) : null}
  </aside>
);

export default ApplyPreviewAside;
