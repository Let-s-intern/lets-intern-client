import { fileType, uploadFile } from '@/api/file';
import { generateAndUploadThumbnail } from '@/domain/admin/program/challenge/utils/generateThumbnail';
import ImageUpload from '@/domain/admin/program/ui/form/ImageUpload';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import { ChallengeType, ChallengeVersionReq } from '@/schema';
import { Button, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
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

/** 노출 제목 기본값. 버전명이 비면 만들지 않는다 */
export const autoProgramTitle = (
  versionTitle: string,
  challengeTitle: string,
) =>
  versionTitle.trim()
    ? `[${versionTitle.trim()}] ${challengeTitle}`.trimEnd()
    : '';

interface Props {
  /** 배열 순서가 곧 노출 순서 */
  versions: ChallengeVersionDraft[];
  onChange: (next: ChallengeVersionDraft[]) => void;
  /** 노출 제목 기본값 '[버전명] 챌린지 제목' 의 챌린지 제목 */
  challengeTitle?: string;
  /** 한 줄 설명 기본값 */
  challengeShortDesc?: string | null;
  /** 버전 썸네일 자동 생성의 템플릿 유형. 챌린지 복제의 썸네일 생성과 같은 방식으로 만든다 */
  challengeType?: ChallengeType;
}

function ChallengeVersionSection({
  versions,
  onChange,
  challengeTitle = '',
  challengeShortDesc = null,
  challengeType,
}: Props) {
  // 펼친 카드 하나만 노출 정보 입력란을 렌더한다
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  // 업로드처럼 await 뒤에 바꾸는 경우에도 최신 목록을 기준으로 바꾼다
  const latestVersions = useRef(versions);
  latestVersions.current = versions;
  // 자동 생성한 썸네일 주소. 이 주소면 버전명이 바뀔 때 다시 만들어도 된다
  const autoThumbnails = useRef(new Set<string>());
  const [thumbnailStatus, setThumbnailStatus] = useState<
    Record<number, 'loading' | 'unsupported' | 'error'>
  >({});

  // 챌린지 제목·한 줄 설명이 바뀌면 아직 기본값을 쓰는 버전도 따라 바꾼다
  const previousBase = useRef({ challengeTitle, challengeShortDesc });
  useEffect(() => {
    const prev = previousBase.current;
    previousBase.current = { challengeTitle, challengeShortDesc };
    if (
      prev.challengeTitle === challengeTitle &&
      prev.challengeShortDesc === challengeShortDesc
    )
      return;
    let changed = false;
    const next = latestVersions.current.map((version) => {
      const followsTitle =
        version.programTitle !== '' &&
        version.programTitle ===
          autoProgramTitle(version.title, prev.challengeTitle);
      const followsShortDesc =
        (version.shortDesc || null) === (prev.challengeShortDesc || null);
      if (!followsTitle && !followsShortDesc) return version;
      changed = true;
      return {
        ...version,
        programTitle: followsTitle
          ? autoProgramTitle(version.title, challengeTitle)
          : version.programTitle,
        shortDesc: followsShortDesc
          ? challengeShortDesc || null
          : version.shortDesc,
      };
    });
    if (changed) onChange(next);
  }, [challengeTitle, challengeShortDesc, onChange]);

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

  const handleTitleChange = (index: number, title: string) => {
    const version = latestVersions.current[index];
    // 노출 제목이 비었거나 기본값 그대로면 새 버전명으로 다시 만든다
    const followsAuto =
      version.programTitle === '' ||
      version.programTitle === autoProgramTitle(version.title, challengeTitle);
    updateVersion(index, {
      title,
      ...(followsAuto
        ? { programTitle: autoProgramTitle(title, challengeTitle) }
        : {}),
    });
  };

  const generateThumbnail = async (index: number) => {
    const version = latestVersions.current[index];
    if (!challengeType || !version?.title.trim()) return;
    setThumbnailStatus((prev) => ({ ...prev, [index]: 'loading' }));
    try {
      // 복제 모달과 같은 생성기. 제목의 [버전명] 으로 Ver 배너, N기 로 기수 배지를 그린다
      const url = await generateAndUploadThumbnail(
        challengeType,
        autoProgramTitle(version.title, challengeTitle),
      );
      if (!url) {
        setThumbnailStatus((prev) => ({ ...prev, [index]: 'unsupported' }));
        return;
      }
      autoThumbnails.current.add(url);
      const current = latestVersions.current[index];
      const followsAutoDesktop =
        !current.desktopThumbnail ||
        autoThumbnails.current.has(current.desktopThumbnail);
      updateVersion(index, {
        thumbnail: url,
        ...(followsAutoDesktop ? { desktopThumbnail: url } : {}),
      });
      setThumbnailStatus(({ [index]: _, ...rest }) => rest);
    } catch {
      setThumbnailStatus((prev) => ({ ...prev, [index]: 'error' }));
    }
  };

  // 썸네일이 비었거나 자동으로 만든 것일 때만 버전명에 맞춰 다시 만든다
  const handleTitleBlur = (index: number) => {
    const version = latestVersions.current[index];
    if (!version.thumbnail || autoThumbnails.current.has(version.thumbnail)) {
      void generateThumbnail(index);
    }
  };

  const handleAdd = () => {
    onChange([
      ...versions,
      { ...emptyVersion, shortDesc: challengeShortDesc || null },
    ]);
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
        버전마다 목록 카드와 상세 페이지가 따로 보이고, 참여자는 들어온 버전
        페이지의 버전으로 신청합니다. 버전별 미션은 미션 등록에서 지정합니다.
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
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                  onBlur={() => handleTitleBlur(index)}
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
                    placeholder="버전명을 넣으면 [버전명] 챌린지 제목으로 채워집니다"
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
                    placeholder="기본 정보의 한 줄 설명으로 채워집니다"
                    value={version.shortDesc ?? ''}
                    onChange={(e) =>
                      updateVersion(index, { shortDesc: e.target.value })
                    }
                    InputLabelProps={inputLabelProps}
                  />
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={
                        !challengeType ||
                        !version.title.trim() ||
                        thumbnailStatus[index] === 'loading'
                      }
                      onClick={() => generateThumbnail(index)}
                    >
                      썸네일 다시 만들기
                    </Button>
                    <Typography variant="caption" color="text.secondary">
                      {thumbnailStatus[index] === 'loading'
                        ? '버전 썸네일을 만드는 중입니다.'
                        : thumbnailStatus[index] === 'unsupported'
                          ? '자동 생성 템플릿이 없는 유형이거나 챌린지 제목에 기수(N기)가 없습니다. 직접 올려주세요.'
                          : thumbnailStatus[index] === 'error'
                            ? '썸네일을 자동으로 만들지 못했습니다. 직접 올려주세요.'
                            : '챌린지 복제와 같은 템플릿에 버전명 배너와 기수를 넣어 자동으로 만듭니다. 직접 올리면 그 이미지를 씁니다.'}
                    </Typography>
                  </div>
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
                  <Typography variant="caption" color="text.secondary">
                    상세 설명은 아래 프로그램 소개의 버전 탭에서 작성합니다.
                  </Typography>
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
