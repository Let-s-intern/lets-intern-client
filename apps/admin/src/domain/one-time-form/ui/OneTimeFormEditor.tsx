import { Button } from '@mui/material';

import type { AdminOneTimeFormDetail } from '@/api/one-time-form/oneTimeFormSchema';

import { useOneTimeFormSettings } from '../hooks/useOneTimeFormSettings';
import { useOptionGroupEditor } from '../option/hooks/useOptionGroupEditor';
import OptionGroupSection from '../option/ui/OptionGroupSection';
import QuestionSection from '../question/ui/QuestionSection';
import ApplyPreviewAside from './ApplyPreviewAside';
import BasicInfoSection from './BasicInfoSection';
import PaymentSettingsSection from './PaymentSettingsSection';

interface OneTimeFormEditorProps {
  /** 없으면 새 폼 만들기. 질문·옵션 섹션은 폼이 만들어진 뒤에만 붙는다 */
  detail?: AdminOneTimeFormDetail;
}

/**
 * 왼쪽은 섹션을 쌓고, 오른쪽은 신청 화면 미리보기를 붙여 둔다(시안 7절).
 * 섹션마다 자기 엔드포인트로 저장한다. 기본 정보·결제 설정은 A2·A4 를 함께 쓴다.
 * 미리보기가 저장 전 값을 보여 주도록 설정과 옵션 상태를 여기서 들고 있는다.
 */
const OneTimeFormEditor = ({ detail }: OneTimeFormEditorProps) => {
  const settings = useOneTimeFormSettings(detail?.form);
  const optionEditor = useOptionGroupEditor(
    detail?.form.formId,
    detail?.optionGroups ?? [],
  );
  const { values } = settings;
  const applicationCount = detail?.form.applicationCount ?? 0;

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
          <PaymentSettingsSection
            values={values}
            errors={settings.errors}
            setField={settings.setField}
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
        {detail && (
          <>
            <OptionGroupSection
              editor={optionEditor}
              applicationCount={applicationCount}
            />
            <QuestionSection
              formId={detail.form.formId}
              applicationCount={applicationCount}
              questions={detail.questions}
            />
          </>
        )}
      </div>

      <ApplyPreviewAside
        values={values}
        optionGroups={optionEditor.groups}
        applicationCount={applicationCount}
      />
    </div>
  );
};

export default OneTimeFormEditor;
