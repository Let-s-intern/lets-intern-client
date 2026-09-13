import Heading2 from '@/domain/admin/ui/heading/Heading2';
import { ChallengeVersionReq } from '@/schema';
import { Button, TextField, Typography } from '@mui/material';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { FaTrashCan } from 'react-icons/fa6';

/** 새로 추가한 버전은 challengeVersionId 가 null */
export type ChallengeVersionDraft = Pick<
  ChallengeVersionReq,
  'challengeVersionId' | 'title'
>;

const TITLE_MAX_LENGTH = 50;

const inputLabelProps = {
  shrink: true,
  style: { fontSize: '14px' },
};

const iconButtonStyle = { minWidth: 0, padding: 12 };

interface Props {
  /** 배열 순서가 곧 노출 순서 */
  versions: ChallengeVersionDraft[];
  onChange: (next: ChallengeVersionDraft[]) => void;
}

function ChallengeVersionSection({ versions, onChange }: Props) {
  const handleAdd = () => {
    onChange([...versions, { challengeVersionId: null, title: '' }]);
  };

  const handleTitleChange = (index: number, title: string) => {
    onChange(
      versions.map((version, i) =>
        i === index ? { ...version, title } : version,
      ),
    );
  };

  const handleMove = (from: number, to: number) => {
    const next = [...versions];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
  };

  const handleDelete = (index: number) => {
    onChange(versions.filter((_, i) => i !== index));
  };

  return (
    <>
      <Heading2>버전 설정</Heading2>
      <Typography
        variant="caption"
        color="text.secondary"
        component="p"
        className="mb-3"
      >
        버전이 없으면 모든 참여자가 같은 자료를 봅니다. 참여자는 신청할 때
        버전을 하나 고릅니다.
      </Typography>

      <div className="mb-4 flex flex-col items-start gap-4">
        {versions.map((version, index) => {
          const isTitleEmpty = version.title.trim() === '';
          const order = index + 1;

          return (
            <div className="flex items-start gap-2" key={index}>
              <span className="w-5 pt-2">{order}</span>
              <Button
                variant="text"
                aria-label={`${order}번 버전 위로 이동`}
                disabled={index === 0}
                onClick={() => handleMove(index, index - 1)}
                style={iconButtonStyle}
              >
                <FaArrowUp />
              </Button>
              <Button
                variant="text"
                aria-label={`${order}번 버전 아래로 이동`}
                disabled={index === versions.length - 1}
                onClick={() => handleMove(index, index + 1)}
                style={iconButtonStyle}
              >
                <FaArrowDown />
              </Button>
              <TextField
                variant="outlined"
                size="small"
                label="버전 제목"
                placeholder="예: 대학생"
                value={version.title}
                onChange={(e) => handleTitleChange(index, e.target.value)}
                error={isTitleEmpty}
                helperText={
                  isTitleEmpty ? '버전 제목을 입력해주세요.' : undefined
                }
                InputLabelProps={inputLabelProps}
                inputProps={{ maxLength: TITLE_MAX_LENGTH }}
              />
              <Button
                variant="text"
                color="error"
                aria-label={`${order}번 버전 삭제`}
                onClick={() => handleDelete(index)}
                style={iconButtonStyle}
              >
                <FaTrashCan />
              </Button>
            </div>
          );
        })}
      </div>

      <Button variant="outlined" onClick={handleAdd}>
        버전 추가
      </Button>
    </>
  );
}

export default ChallengeVersionSection;
