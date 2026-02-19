import { Button } from '@mui/material';

interface BlogActionButtonsProps {
  onCancel: () => void;
  onSaveTemp: () => void;
  onPublish: () => void;
}

const BlogActionButtons = ({
  onCancel,
  onSaveTemp,
  onPublish,
}: BlogActionButtonsProps) => {
  return (
    <div className="text-right">
      <div className="mb-1 flex items-center justify-end gap-4">
        <Button variant="outlined" type="button" onClick={onCancel}>
          취소 (리스트로 돌아가기)
        </Button>
        <Button
          variant="outlined"
          color="primary"
          type="button"
          onClick={onSaveTemp}
        >
          임시 저장
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="button"
          onClick={onPublish}
        >
          발행
        </Button>
      </div>
      <span className="text-0.875 text-neutral-35">
        *임시 저장: 블로그가 숨겨집니다.
      </span>
    </div>
  );
};

export default BlogActionButtons;
