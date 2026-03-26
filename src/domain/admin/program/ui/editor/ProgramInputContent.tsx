import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { useMemo, useRef } from 'react';
import styled from 'styled-components';
import Input from '../../../../../common/input/v1/Input';
import storage from '../../../../../Firebase';
import {
  challengeTypes,
  challengeTypeToText,
  newProgramFeeTypeToText,
  newProgramTypeDetailToText,
  newProgramTypeToText,
  programParticipationTypeToText,
  programPriceTypes,
  programPriceTypeToText,
} from '../../../../../utils/convert';
import ImageUpload from '../form/ImageUpload';
import FAQEditor from './FAQEditor';

interface ProgramEditorProps {
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  editorMode: 'create' | 'edit';
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProgramInputContent = ({
  value,
  setValue,
  handleSubmit,
  content,
  setContent,
  editorMode,
  handleImageUpload,
}: ProgramEditorProps) => {
  const router = useRouter();
  const quillRef = useRef<any>();

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.addEventListener('change', async () => {
      const editor = quillRef.current.getEditor();
      const file = input.files?.[0];
      const range = editor.getSelection(true);
      try {
        // 파일명을 "image/Date.now()"로 저장
        const storageRef = ref(storage, `image/${Date.now()}`);
        // Firebase Method : uploadBytes, getDownloadURL
        await uploadBytes(storageRef, file!).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            // 이미지 URL 에디터에 삽입
            editor.insertEmbed(range.index, 'image', url);
            // URL 삽입 후 커서를 이미지 뒷 칸으로 이동
            editor.setSelection(range.index + 1);
          });
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    });
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'], // 표시할 스타일링 옵션
          ['blockquote', 'code-block'],

          [{ header: 1 }, { header: 2 }], // 커스텀 헤더 옵션
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }], // 서브스크립트/수퍼스크립트
          [{ indent: '-1' }, { indent: '+1' }], // 들여쓰기
          [{ direction: 'rtl' }], // 텍스트 방향

          [{ size: ['small', false, 'large', 'huge'] }], // 폰트 크기
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          [{ color: [] }, { background: [] }], // 글자색, 배경색
          [{ font: [] }],
          [{ align: [] }],

          ['clean'], // 포맷 제거
          ['image'], // 이미지 업로드
        ],
        handlers: {
          image: imageHandler, // imageHandler는 이미지 업로드 로직을 처리하는 함수입니다.
        },
      },
    }),
    [],
  );

  return (
    <div className="mx-auto max-w-xl p-8">
      <header className="my-5 text-2xl font-bold">프로그램 개설</header>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormControl fullWidth>
          <InputLabel id="program">프로그램</InputLabel>
          <Select
            labelId="program"
            id="program"
            label="프로그램"
            name="program"
            value={value?.program || ''}
            onChange={(e) => {
              setValue({ ...value, [e.target.name]: e.target.value });
            }}
          >
            {Object.keys(newProgramTypeToText).map((type: string) => (
              <MenuItem key={type} value={type}>
                {newProgramTypeToText[type]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {value.program && (
          <>
            <FormControl fullWidth>
              <InputLabel id="programType">프로그램 분류</InputLabel>
              <Select
                labelId="programType"
                label="프로그램 분류"
                id="programType"
                name="programType"
                multiple
                value={value.programType || []}
                onChange={(e) => {
                  setValue({ ...value, [e.target.name]: e.target.value });
                }}
                input={<OutlinedInput label="프로그램 분류" />}
                renderValue={(selectedList: string[]) => (
                  <div className="flex flex-wrap gap-2">
                    {selectedList.map((value) => (
                      <Chip
                        key={value}
                        label={newProgramTypeDetailToText[value]}
                      />
                    ))}
                  </div>
                )}
              >
                {Object.keys(newProgramTypeDetailToText).map((type) => (
                  <MenuItem key={type} value={type}>
                    {newProgramTypeDetailToText[type]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {value.program === 'LIVE' && (
              <>
                <FormControl fullWidth>
                  <InputLabel id="way">온/오프라인 여부</InputLabel>
                  <Select
                    labelId="way"
                    id="way"
                    label="온/오프라인 여부"
                    name="way"
                    value={value?.way || ''}
                    onChange={(e) => {
                      setValue({ ...value, [e.target.name]: e.target.value });
                    }}
                  >
                    <MenuItem value="OFFLINE">오프라인</MenuItem>
                    <MenuItem value="ONLINE">온라인</MenuItem>
                    <MenuItem value="ALL">온오프라인 병행</MenuItem>
                  </Select>
                </FormControl>
                {(value.way === 'OFFLINE' || value.way === 'ALL') && (
                  <Input
                    label="장소"
                    name="location"
                    value={value.location ? value.location : ''}
                    placeholder="장소를 입력해주세요"
                    onChange={(e) =>
                      setValue({ ...value, [e.target.name]: e.target.value })
                    }
                    disabled={!value.way || value.way === 'ONLINE'}
                  />
                )}
              </>
            )}
            {(value.program === 'LIVE' || value.program === 'VOD') && (
              <FormControl fullWidth>
                <InputLabel id="job">직무</InputLabel>
                <Select
                  labelId="job"
                  id="job"
                  label="직무"
                  name="job"
                  value={value?.job || ''}
                  onChange={(e) => {
                    setValue({ ...value, [e.target.name]: e.target.value });
                  }}
                >
                  <MenuItem value="경영관리">경영관리</MenuItem>
                  <MenuItem value="금융">금융</MenuItem>
                  <MenuItem value="마케팅">마케팅</MenuItem>
                  <MenuItem value="광고">광고</MenuItem>
                  <MenuItem value="디자인">디자인</MenuItem>
                  <MenuItem value="방송">방송</MenuItem>
                  <MenuItem value="개발">개발</MenuItem>
                  <MenuItem value="영업">영업</MenuItem>
                  <MenuItem value="서비스기획">서비스기획</MenuItem>
                  <MenuItem value="사업전략">사업전략</MenuItem>
                  <MenuItem value="컨설팅">컨설팅</MenuItem>
                  <MenuItem value="유통">유통</MenuItem>
                  <MenuItem value="공정연구">공정연구</MenuItem>
                </Select>
              </FormControl>
            )}
            {value.program === 'CHALLENGE' && (
              <>
                <FormControl fullWidth>
                  <InputLabel id="challengeType">챌린지 구분</InputLabel>
                  <Select
                    labelId="challengeType"
                    id="challengeType"
                    label="챌린지 구분"
                    name="challengeType"
                    value={value.challengeType}
                    onChange={(e) => {
                      setValue({ ...value, [e.target.name]: e.target.value });
                    }}
                  >
                    {challengeTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {challengeTypeToText[type]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="priceType">가격 구분</InputLabel>
                  <Select
                    labelId="priceType"
                    id="priceType"
                    label="가격 구분"
                    name="priceType"
                    value={value.priceType}
                    onChange={(e) => {
                      setValue({ ...value, [e.target.name]: e.target.value });
                    }}
                  >
                    {programPriceTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {programPriceTypeToText[type]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="participationType">참여 형태</InputLabel>
                  <Select
                    labelId="participationType"
                    id="participationType"
                    label="참여 형태"
                    name="participationType"
                    value={value.participationType}
                    onChange={(e) => {
                      setValue({ ...value, [e.target.name]: e.target.value });
                    }}
                  >
                    {Object.keys(programParticipationTypeToText).map(
                      (type: string) => (
                        <MenuItem key={type} value={type}>
                          {programParticipationTypeToText[type]}
                        </MenuItem>
                      ),
                    )}
                  </Select>
                </FormControl>
              </>
            )}
            <ImageUpload
              label="프로그램 썸네일 이미지 업로드"
              id="thumbnail"
              name="thumbnail"
              image={value?.thumbnail || ''}
              onChange={handleImageUpload}
            />
            <Input
              label="제목"
              type="text"
              name="title"
              placeholder="제목을 입력해주세요"
              value={value?.title || ''}
              onChange={(e) => {
                setValue({ ...value, [e.target.name]: e.target.value });
              }}
            />
            <Input
              label="한 줄 설명"
              type="text"
              name="shortDescription"
              placeholder="한 줄 설명을 입력해주세요"
              value={value?.shortDescription || ''}
              onChange={(e) => {
                setValue({ ...value, [e.target.name]: e.target.value });
              }}
            />
            {value.program === 'VOD' && (
              <Input
                label="리틀리 링크"
                type="text"
                name="link"
                placeholder="리틀리 링크를 입력해주세요"
                value={value?.link || ''}
                onChange={(e) => {
                  setValue({ ...value, [e.target.name]: e.target.value });
                }}
              />
            )}
            {(value.program === 'CHALLENGE' || value.program === 'LIVE') && (
              <Input
                label="정원"
                type="number"
                name="headcount"
                placeholder="총 정원 수를 입력해주세요"
                value={value?.headcount || ''}
                onChange={(e) => {
                  setValue({ ...value, [e.target.name]: e.target.value });
                }}
              />
            )}
            {value.program === 'LIVE' && (
              <Input
                label="멘토 이름"
                type="text"
                name="mentorName"
                placeholder="멘토 이름을 입력해주세요"
                value={value?.mentorName || ''}
                onChange={(e) => {
                  setValue({ ...value, [e.target.name]: e.target.value });
                }}
              />
            )}
            {value.program === 'CHALLENGE' && (
              <>
                <Input
                  label="카카오톡 오픈채팅 링크"
                  name="openKakaoLink"
                  value={value.openKakaoLink || ''}
                  placeholder="카카오톡 오픈채팅 링크를 입력하세요"
                  onChange={(e) =>
                    setValue({ ...value, [e.target.name]: e.target.value })
                  }
                />
                <Input
                  label="카카오톡 오픈채팅 비밀번호"
                  name="openKakaoPassword"
                  value={value.openKakaoPassword || ''}
                  placeholder="카카오톡 오픈채팅 비밀번호를 입력하세요"
                  onChange={(e) =>
                    setValue({ ...value, [e.target.name]: e.target.value })
                  }
                />
              </>
            )}
            {(value.program === 'CHALLENGE' || value.program === 'LIVE') && (
              <FormControl fullWidth>
                <InputLabel id="feeType">금액유형</InputLabel>
                <Select
                  labelId="feeType"
                  id="feeType"
                  name="feeType"
                  label="금액유형"
                  value={value?.feeType || ''}
                  onChange={(e) => {
                    setValue({ ...value, [e.target.name]: e.target.value });
                  }}
                >
                  {value.program === 'LIVE' && (
                    <MenuItem value="FREE">
                      {newProgramFeeTypeToText['FREE']}
                    </MenuItem>
                  )}
                  <MenuItem value="CHARGE">
                    {newProgramFeeTypeToText['CHARGE']}
                  </MenuItem>
                  {value.program === 'CHALLENGE' && (
                    <MenuItem value="REFUND">
                      {newProgramFeeTypeToText['REFUND']}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            )}
            {(value.program === 'CHALLENGE' || value.program === 'LIVE') &&
              (value.feeType === 'CHARGE' || value.feeType === 'REFUND') && (
                <>
                  {value.program === 'CHALLENGE' &&
                    (value.priceType === 'BASIC' ||
                      value.priceType === 'ALL') && (
                      <>
                        <Input
                          label="베이직 이용료 금액"
                          type="number"
                          name="basicPrice"
                          placeholder="이용료 금액을 입력해주세요"
                          value={value?.basicPrice || ''}
                          onChange={(e) => {
                            setValue({
                              ...value,
                              [e.target.name]: e.target.value,
                            });
                          }}
                        />
                        {value.feeType === 'REFUND' && (
                          <Input
                            label="베이직 보증금 금액"
                            type="number"
                            name="basicRefund"
                            placeholder="보증금 금액을 입력해주세요"
                            value={value?.basicRefund || ''}
                            onChange={(e) => {
                              setValue({
                                ...value,
                                [e.target.name]: e.target.value,
                              });
                            }}
                          />
                        )}
                        <Input
                          label="베이직 할인 금액"
                          type="number"
                          name="basicDiscount"
                          placeholder="할인 금액을 입력해주세요"
                          value={value?.basicDiscount || ''}
                          onChange={(e) => {
                            setValue({
                              ...value,
                              [e.target.name]: e.target.value,
                            });
                          }}
                        />
                      </>
                    )}
                  {value.program === 'CHALLENGE' &&
                    (value.priceType === 'PREMIUM' ||
                      value.priceType === 'ALL') && (
                      <>
                        <Input
                          label="프리미엄 이용료 금액"
                          type="number"
                          name="premiumPrice"
                          placeholder="이용료 금액을 입력해주세요"
                          value={value?.premiumPrice || ''}
                          onChange={(e) => {
                            setValue({
                              ...value,
                              [e.target.name]: e.target.value,
                            });
                          }}
                        />
                        {value.feeType === 'REFUND' && (
                          <Input
                            label="프리미엄 보증금 금액"
                            type="number"
                            name="premiumRefund"
                            placeholder="보증금 금액을 입력해주세요"
                            value={value?.premiumRefund || ''}
                            onChange={(e) => {
                              setValue({
                                ...value,
                                [e.target.name]: e.target.value,
                              });
                            }}
                          />
                        )}
                        <Input
                          label="프리미엄 할인 금액"
                          type="number"
                          name="premiumDiscount"
                          placeholder="할인 금액을 입력해주세요"
                          value={value?.premiumDiscount || ''}
                          onChange={(e) => {
                            setValue({
                              ...value,
                              [e.target.name]: e.target.value,
                            });
                          }}
                        />
                      </>
                    )}
                  {value.program === 'LIVE' && (
                    <>
                      <Input
                        label="이용료 금액"
                        type="number"
                        name="price"
                        placeholder="이용료 금액을 입력해주세요"
                        value={value?.price || ''}
                        onChange={(e) => {
                          setValue({
                            ...value,
                            [e.target.name]: e.target.value,
                          });
                        }}
                      />
                      <Input
                        label="할인 금액"
                        type="number"
                        name="discount"
                        placeholder="할인 금액을 입력해주세요"
                        value={value?.discount || ''}
                        onChange={(e) => {
                          setValue({
                            ...value,
                            [e.target.name]: e.target.value,
                          });
                        }}
                      />
                    </>
                  )}
                </>
              )}
            {(value.program === 'CHALLENGE' || value.program === 'LIVE') && (
              <>
                <DateTimeControl>
                  <DateTimeLabel htmlFor="startDate">시작 일자</DateTimeLabel>
                  <input
                    id="startDate"
                    type="datetime-local"
                    name="startDate"
                    value={value.startDate}
                    onChange={(e) =>
                      setValue({ ...value, [e.target.name]: e.target.value })
                    }
                    step={600}
                  />
                </DateTimeControl>
                <DateTimeControl>
                  <DateTimeLabel htmlFor="endDate">종료 일자</DateTimeLabel>
                  <input
                    id="endDate"
                    type="datetime-local"
                    name="endDate"
                    value={value.endDate}
                    onChange={(e) =>
                      setValue({ ...value, [e.target.name]: e.target.value })
                    }
                  />
                </DateTimeControl>
                <DateTimeControl>
                  <DateTimeLabel htmlFor="beginning">
                    모집 시작 일자
                  </DateTimeLabel>
                  <input
                    id="beginning"
                    type="datetime-local"
                    name="beginning"
                    value={value.beginning}
                    onChange={(e) =>
                      setValue({ ...value, [e.target.name]: e.target.value })
                    }
                  />
                </DateTimeControl>
                <DateTimeControl>
                  <DateTimeLabel htmlFor="dueDate">
                    모집 마감 일자
                  </DateTimeLabel>
                  <input
                    id="dueDate"
                    type="datetime-local"
                    name="dueDate"
                    value={value.dueDate}
                    onChange={(e) =>
                      setValue({ ...value, [e.target.name]: e.target.value })
                    }
                  />
                </DateTimeControl>
              </>
            )}
            {(value.program === 'CHALLENGE' || value.program === 'LIVE') && (
              <div>
                <div>(수정불가)</div>
                <hr />
                <div dangerouslySetInnerHTML={{ __html: content }} />
                <hr />
              </div>
              //  <ReactQuill
              //    modules={modules}
              //    placeholder="상세 내용을 입력해주세요."
              //    ref={quillRef}
              //    value={content ? content : ''}
              //    onChange={(value) => {
              //      setContent(value);
              //    }}
              //  />
            )}
            {/* {(value.program === 'CHALLENGE' || value.program === 'LIVE') && (
              <TextField
                label="필독사항"
                name="criticalNotice"
                placeholder="필독사항을 입력해주세요"
                value={value?.criticalNotice || ''}
                onChange={(e) => {
                  setValue({
                    ...value,
                    [e.target.name]: e.target.value,
                  });
                }}
                fullWidth
                multiline
                rows={4}
              />
            )} */}
            {(value.program === 'CHALLENGE' || value.program === 'LIVE') && (
              <FAQEditor
                programType={value.program}
                value={value}
                setValue={setValue}
              />
            )}
          </>
        )}
        <div className="flex justify-end gap-2">
          <button
            type="submit"
            className="w-20 rounded-xxs bg-indigo-600 py-2 text-center font-medium text-white"
          >
            {editorMode === 'create' ? '등록' : '수정'}
          </button>
          <button
            type="button"
            className="w-20 rounded-xxs bg-gray-400 py-2 text-center font-medium text-white"
            onClick={() => router.back()}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgramInputContent;

const DateTimeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DateTimeLabel = styled.label`
  font-weight: 500;
  width: 8rem;
`;
