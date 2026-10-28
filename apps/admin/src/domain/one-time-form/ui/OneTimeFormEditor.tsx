import { Button } from '@mui/material';

import type { AdminOneTimeFormDetail } from '@/api/one-time-form/oneTimeFormSchema';

import { useOneTimeFormSettings } from '../hooks/useOneTimeFormSettings';
import BasicInfoSection from './BasicInfoSection';
import ProductCardPreview from './ProductCardPreview';

interface OneTimeFormEditorProps {
  /** 없으면 새 폼 만들기. 질문·옵션 섹션은 폼이 만들어진 뒤에만 붙는다 */
  detail?: AdminOneTimeFormDetail;
}

/**
 * 왼쪽은 섹션을 쌓고, 오른쪽은 신청 화면 미리보기를 붙여 둔다(시안 7절).
 * 섹션마다 자기 엔드포인트로 저장한다. 기본 정보·결제 설정은 A2·A4 를 함께 쓴다.
 */
const OneTimeFormEditor = ({ detail }: OneTimeFormEditorProps) => {
  const settings = useOneTimeFormSettings(detail?.form);
  const { values } = settings;

  return (
    <div className="flex items-start gap-8">
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <div className="border-neutral-80 flex flex-col gap-8 rounded-md border p-6">
          <BasicInfoSection
            values={values}
            errors={settings.errors}
            setField={settings.setField}
            isSlugLocked={detail?.form.isSlugLocked ?? false}
            isUploadingThumbnail={settings.isUploadingThumbnail}
            onUploadThumbnail={settings.uploadThumbnail}
          />
          <div className="flex justify-end">
            <Button
              variant="contained"
              disabled={settings.isSaving || settings.isUploadingThumbnail}
              onClick={settings.save}
            >
              {detail ? '저장' : '폼 만들기'}
            </Button>
          </div>
        </div>
      </div>

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
        />
      </aside>
    </div>
  );
};

export default OneTimeFormEditor;
