import { fileType, uploadFile } from '@/api/file';
import ChallengeVersionContentEditor from '@/domain/admin/program/challenge/ChallengeVersionContentEditor';
import ImageUpload from '@/domain/admin/program/ui/form/ImageUpload';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import { ChallengeType, ChallengeVersionReq } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import { useRef, useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { FaTrashCan } from 'react-icons/fa6';

/** 새로 추가한 버전은 challengeVersionId 가 null. 순서는 배열 순서라 sortOrder 는 없다 */
export type ChallengeVersionDraft = Omit<ChallengeVersionReq, 'sortOrder'>;

type ThumbnailField = 'thumbnail' | 'desktopThumbnail';

const TITLE_MAX_LENGTH = 50;

const emptyVersion: ChallengeVersionDraft = {
  challengeVersionId: null,
  title: '',
  programTitle: '',
  shortDesc: null,
  thumbnail: '',
  desktopThumbnail: null,
  description: null,
};

const inputLabelProps = {
  shrink: true,
  style: { fontSize: '14px' },
};

const iconButtonStyle = { minWidth: 0, padding: 12 };

interface Props {
  /** 배열 순서가 곧 노출 순서 */
  versions: ChallengeVersionDraft[];
  onChange: (next: ChallengeVersionDraft[]) => void;
  /** 버전 상세 본문 편집기의 강의 섹션이 쓴다 */
  challengeType?: ChallengeType;
  /** 버전 전용 상세 본문을 켤 때 시작값으로 복사하는 챌린지 본문 */
  challengeContent: ChallengeContent;
}

function ChallengeVersionSection({
  versions,
  onChange,
  challengeType,
  challengeContent,
}: Props) {
  // 펼친 카드 하나만 본문 편집기를 렌더한다
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  // 업로드처럼 await 뒤에 바꾸는 경우에도 최신 목록을 기준으로 바꾼다
  const latestVersions = useRef(versions);
  latestVersions.current = versions;

  const updateVersion = (
    index: number,
    patch: Partial<ChallengeVersionDraft>,
  ) => {
    onChange(
      latestVersions.current.map((version, i) =>
        i === index ? { ...version, ...patch } : version,
      ),
    );
  };

  const handleAdd = () => {
    onChange([...versions, emptyVersion]);
    setExpandedIndex(versions.length);
  };

  const handleMove = (from: number, to: number) => {
    const next = [...versions];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
    // 펼친 카드가 자리를 옮기면 펼침도 따라간다
    setExpandedIndex((prev) => {
      if (prev === from) return to;
      if (prev === to) return from;
      return prev;
    });
  };

  const handleDelete = (index: number) => {
    onChange(versions.filter((_, i) => i !== index));
    setExpandedIndex((prev) => {
      if (prev === null || prev === index) return null;
      return prev > index ? prev - 1 : prev;
    });
  };

  const handleToggle = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const handleThumbnailChange =
    (index: number, field: ThumbnailField) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = await uploadFile({ file, type: fileType.enum.CHALLENGE });
      updateVersion(index, { [field]: url });
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

      <div className="mb-4 flex flex-col gap-4">
        {versions.map((version, index) => {
          const isTitleEmpty = version.title.trim() === '';
          const isProgramTitleEmpty = version.programTitle.trim() === '';
          const isExpanded = expandedIndex === index;
          const order = index + 1;

          return (
            <div
              className="rounded-xxs border-neutral-80 border p-3"
              key={index}
            >
              <div className="flex items-start gap-2">
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
                  onChange={(e) =>
                    updateVersion(index, { title: e.target.value })
                  }
                  error={isTitleEmpty}
                  helperText={
                    isTitleEmpty ? '버전 제목을 입력해주세요.' : undefined
                  }
                  InputLabelProps={inputLabelProps}
                  inputProps={{ maxLength: TITLE_MAX_LENGTH }}
                />
                <Button
                  variant="outlined"
                  aria-expanded={isExpanded}
                  aria-label={`${order}번 버전 ${isExpanded ? '접기' : '펼치기'}`}
                  onClick={() => handleToggle(index)}
                >
                  {isExpanded ? '접기' : '노출 정보 편집'}
                </Button>
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

              {isExpanded && (
                <div className="mt-4 flex flex-col gap-4">
                  <TextField
                    variant="outlined"
                    size="small"
                    label="노출 제목"
                    placeholder="목록 카드와 상세 페이지에 보이는 제목"
                    value={version.programTitle}
                    onChange={(e) =>
                      updateVersion(index, { programTitle: e.target.value })
                    }
                    error={isProgramTitleEmpty}
                    helperText={
                      isProgramTitleEmpty
                        ? '노출 제목을 입력해주세요.'
                        : undefined
                    }
                    InputLabelProps={inputLabelProps}
                  />
                  <TextField
                    variant="outlined"
                    size="small"
                    label="한 줄 설명"
                    placeholder="비우면 챌린지 한 줄 설명을 씁니다"
                    value={version.shortDesc ?? ''}
                    onChange={(e) =>
                      updateVersion(index, { shortDesc: e.target.value })
                    }
                    InputLabelProps={inputLabelProps}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <ImageUpload
                      label="모바일 썸네일 (필수)"
                      id={`version-${index}-thumbnail`}
                      image={version.thumbnail}
                      onChange={handleThumbnailChange(index, 'thumbnail')}
                    />
                    <ImageUpload
                      label="데스크탑 썸네일 (비우면 모바일 썸네일)"
                      id={`version-${index}-desktopThumbnail`}
                      image={version.desktopThumbnail}
                      onChange={handleThumbnailChange(
                        index,
                        'desktopThumbnail',
                      )}
                    />
                  </div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={version.description !== null}
                        onChange={(e) =>
                          updateVersion(index, {
                            description: e.target.checked
                              ? JSON.stringify(challengeContent)
                              : null,
                          })
                        }
                      />
                    }
                    label="버전 전용 상세 본문 사용 (끄면 챌린지 상세 본문을 씁니다)"
                  />
                  {version.description !== null && (
                    <ChallengeVersionContentEditor
                      description={version.description}
                      challengeType={challengeType}
                      onChange={(description) =>
                        updateVersion(index, { description })
                      }
                    />
                  )}
                </div>
              )}
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
