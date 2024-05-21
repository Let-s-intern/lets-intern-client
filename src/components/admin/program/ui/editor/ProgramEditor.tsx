import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Input from '../../../../ui/input/Input';
import ReactQuill from 'react-quill';
import styled from 'styled-components';
import FAQEditor from './FAQEditor';
import storage from '../../../../../Firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useMemo, useRef } from 'react';
import ProgramTypeSection from '../editor-section/ProgramTypeSection';
import FeeSection from '../editor-section/FeeSection';
import {
  bankTypeToText,
  challengeTypeToText,
  newProgramFeeTypeToText,
  newProgramTypeDetailToText,
  newProgramTypeToText,
  programParticipationTypeToText,
  programPriceTypeToText,
} from '../../../../../utils/convert';

interface ProgramEditorProps {
  values: any;
  setValues: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  faqList: any;
  faqIdList: any;
  handleFAQAdd: () => void;
  handleFAQDelete: (faqId: number) => void;
  handleFAQChange: (e: any, faqId: number) => void;
  handleFAQCheckChange: (e: any, faqId: number) => void;
  handleFAQIdListReset: () => void;
  editorMode: 'create' | 'edit';
}

const ProgramEditor = ({
  values,
  setValues,
  handleSubmit,
  content,
  setContent,
  faqList,
  faqIdList,
  handleFAQAdd,
  handleFAQDelete,
  handleFAQChange,
  handleFAQCheckChange,
  handleFAQIdListReset,
  editorMode,
}: ProgramEditorProps) => {
  const navigate = useNavigate();
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
      console.log('editor', editor);
      console.log('file', file);
      console.log('range', range);
      try {
        // 파일명을 "image/Date.now()"로 저장
        const storageRef = ref(storage, `image/${Date.now()}`);
        console.log('storageRef', storageRef);
        console.log('imageHandler');
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
        console.log(error);
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
    <div className="mx-auto max-w-xl p-8 font-notosans">
      <header className="my-5 text-2xl font-bold">프로그램 개설</header>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormControl fullWidth>
          <InputLabel id="program">프로그램</InputLabel>
          <Select
            labelId="program"
            id="program"
            label="프로그램"
            name="program"
            value={values?.program || ''}
            onChange={(e) => {
              setValues({ ...values, [e.target.name]: e.target.value });
            }}
          >
            {Object.keys(newProgramTypeToText).map((type: string) => (
              <MenuItem key={type} value={type}>
                {newProgramTypeToText[type]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {values.program && (
          <>
            <FormControl fullWidth>
              <InputLabel id="programType">프로그램 분류</InputLabel>
              <Select
                labelId="programType"
                id="programType"
                label="프로그램 분류"
                name="programType"
                value={values?.programType || ''}
                onChange={(e) => {
                  setValues({ ...values, [e.target.name]: e.target.value });
                }}
              >
                {Object.keys(newProgramTypeDetailToText).map((type: string) => (
                  <MenuItem key={type} value={type}>
                    {newProgramTypeDetailToText[type]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {values.program === 'LIVE' && (
              <>
                <FormControl fullWidth>
                  <InputLabel id="way">온/오프라인 여부</InputLabel>
                  <Select
                    labelId="way"
                    id="way"
                    label="온/오프라인 여부"
                    name="way"
                    value={values?.way || ''}
                    onChange={(e) => {
                      setValues({ ...values, [e.target.name]: e.target.value });
                    }}
                  >
                    <MenuItem value="OFFLINE">오프라인</MenuItem>
                    <MenuItem value="ONLINE">온라인</MenuItem>
                    <MenuItem value="ALL">온오프라인 병행</MenuItem>
                  </Select>
                </FormControl>
                {(values.way === 'OFFLINE' || values.way === 'ALL') && (
                  <Input
                    label="장소"
                    name="location"
                    value={values.location ? values.location : ''}
                    placeholder="장소를 입력해주세요"
                    onChange={(e) =>
                      setValues({ ...values, [e.target.name]: e.target.value })
                    }
                    disabled={!values.way || values.way === 'ONLINE'}
                  />
                )}
              </>
            )}
            {(values.program === 'LIVE' || values.program === 'VOD') && (
              <Input
                label="직무"
                type="text"
                name="job"
                placeholder="직무를 입력해주세요"
                value={values?.job || ''}
                onChange={(e) => {
                  setValues({ ...values, [e.target.name]: e.target.value });
                }}
              />
            )}
            {values.program === 'CHALLENGE' && (
              <>
                <FormControl fullWidth>
                  <InputLabel id="challengeType">챌린지 구분</InputLabel>
                  <Select
                    labelId="challengeType"
                    id="challengeType"
                    label="챌린지 구분"
                    name="challengeType"
                    value={values.challengeType}
                    onChange={(e) => {
                      setValues({ ...values, [e.target.name]: e.target.value });
                    }}
                  >
                    {Object.keys(challengeTypeToText).map((type: string) => (
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
                    value={values.priceType}
                    onChange={(e) => {
                      setValues({ ...values, [e.target.name]: e.target.value });
                    }}
                  >
                    {Object.keys(programPriceTypeToText).map((type: string) => (
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
                    value={values.participationType}
                    onChange={(e) => {
                      setValues({ ...values, [e.target.name]: e.target.value });
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
            <Input
              label="썸네일"
              type="text"
              name="thumbnail"
              placeholder="썸네일 링크를 입력해주세요"
              value={values?.thumbnail || ''}
              onChange={(e) => {
                setValues({ ...values, [e.target.name]: e.target.value });
              }}
            />
            <Input
              label="제목"
              type="text"
              name="title"
              placeholder="제목을 입력해주세요"
              value={values?.title || ''}
              onChange={(e) => {
                setValues({ ...values, [e.target.name]: e.target.value });
              }}
            />
            <Input
              label="한 줄 설명"
              type="text"
              name="shortDescription"
              placeholder="한 줄 설명을 입력해주세요"
              value={values?.shortDescription || ''}
              onChange={(e) => {
                setValues({ ...values, [e.target.name]: e.target.value });
              }}
            />
            {values.program === 'VOD' && (
              <Input
                label="리틀리 링크"
                type="text"
                name="link"
                placeholder="리틀리 링크를 입력해주세요"
                value={values?.link || ''}
                onChange={(e) => {
                  setValues({ ...values, [e.target.name]: e.target.value });
                }}
              />
            )}
            {(values.program === 'CHALLENGE' || values.program === 'LIVE') && (
              <Input
                label="정원"
                type="number"
                name="headcount"
                placeholder="총 정원 수를 입력해주세요"
                value={values?.headcount || ''}
                onChange={(e) => {
                  setValues({ ...values, [e.target.name]: e.target.value });
                }}
              />
            )}
            {values.program === 'CHALLENGE' && (
              <>
                <Input
                  label="카카오톡 오픈채팅 링크"
                  name="openKakaoLink"
                  value={values.openKakaoLink}
                  placeholder="카카오톡 오픈채팅 링크를 입력하세요"
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
                <Input
                  label="카카오톡 오픈채팅 비밀번호"
                  name="openKakaoPassword"
                  value={values.openKakaoPassword}
                  placeholder="카카오톡 오픈채팅 비밀번호를 입력하세요"
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
              </>
            )}
            {(values.program === 'CHALLENGE' || values.program === 'LIVE') && (
              <FormControl fullWidth>
                <InputLabel id="feeType">금액유형</InputLabel>
                <Select
                  labelId="feeType"
                  id="feeType"
                  name="feeType"
                  label="금액유형"
                  value={values?.feeType || ''}
                  onChange={(e) => {
                    setValues({ ...values, [e.target.name]: e.target.value });
                  }}
                >
                  {values.program === 'LIVE' && (
                    <MenuItem value="FREE">
                      {newProgramFeeTypeToText['FREE']}
                    </MenuItem>
                  )}
                  <MenuItem value="CHARGE">
                    {newProgramFeeTypeToText['CHARGE']}
                  </MenuItem>
                  {values.program === 'CHALLENGE' && (
                    <MenuItem value="REFUND">
                      {newProgramFeeTypeToText['REFUND']}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            )}
            {(values.program === 'CHALLENGE' || values.program === 'LIVE') &&
              (values.feeType === 'CHARGE' || values.feeType === 'REFUND') && (
                <>
                  {values.program === 'CHALLENGE' &&
                    (values.priceType === 'BASIC' ||
                      values.priceType === 'ALL') && (
                      <>
                        <Input
                          label="베이직 이용료 금액"
                          type="number"
                          name="basicPrice"
                          placeholder="이용료 금액을 입력해주세요"
                          value={values?.basicPrice || ''}
                          onChange={(e) => {
                            setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                            });
                          }}
                        />
                        {values.feeType === 'REFUND' && (
                          <Input
                            label="베이직 보증금 금액"
                            type="number"
                            name="basicRefund"
                            placeholder="보증금 금액을 입력해주세요"
                            value={values?.basicRefund || ''}
                            onChange={(e) => {
                              setValues({
                                ...values,
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
                          value={values?.basicDiscount || ''}
                          onChange={(e) => {
                            setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                            });
                          }}
                        />
                      </>
                    )}
                  {values.program === 'CHALLENGE' &&
                    (values.priceType === 'PREMIUM' ||
                      values.priceType === 'ALL') && (
                      <>
                        <Input
                          label="프리미엄 이용료 금액"
                          type="number"
                          name="premiumPrice"
                          placeholder="이용료 금액을 입력해주세요"
                          value={values?.premiumPrice || ''}
                          onChange={(e) => {
                            setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                            });
                          }}
                        />
                        {values.feeType === 'REFUND' && (
                          <Input
                            label="프리미엄 보증금 금액"
                            type="number"
                            name="premiumRefund"
                            placeholder="보증금 금액을 입력해주세요"
                            value={values?.premiumRefund || ''}
                            onChange={(e) => {
                              setValues({
                                ...values,
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
                          value={values?.premiumDiscount || ''}
                          onChange={(e) => {
                            setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                            });
                          }}
                        />
                      </>
                    )}
                  {values.program === 'LIVE' && (
                    <>
                      <Input
                        label="이용료 금액"
                        type="number"
                        name="price"
                        placeholder="이용료 금액을 입력해주세요"
                        value={values?.price || ''}
                        onChange={(e) => {
                          setValues({
                            ...values,
                            [e.target.name]: e.target.value,
                          });
                        }}
                      />
                      <Input
                        label="할인 금액"
                        type="number"
                        name="discount"
                        placeholder="할인 금액을 입력해주세요"
                        value={values?.discount || ''}
                        onChange={(e) => {
                          setValues({
                            ...values,
                            [e.target.name]: e.target.value,
                          });
                        }}
                      />
                    </>
                  )}
                  <FormControl fullWidth>
                    <InputLabel id="accountType">입금계좌 은행</InputLabel>
                    <Select
                      labelId="accountType"
                      id="accountType"
                      label="입금계좌 은행"
                      name="accountType"
                      value={values?.accountType || ''}
                      onChange={(e) => {
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        });
                      }}
                    >
                      {Object.keys(bankTypeToText).map((bankType: any) => (
                        <MenuItem key={bankType} value={bankType}>
                          {bankTypeToText[bankType]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Input
                    label="입금 계좌번호"
                    name="accountNumber"
                    placeholder="입금 계좌번호를 입력해주세요"
                    value={values?.accountNumber || ''}
                    onChange={(e) => {
                      setValues({
                        ...values,
                        [e.target.name]: e.target.value,
                      });
                    }}
                  />
                </>
              )}
            {(values.program === 'CHALLENGE' || values.program === 'LIVE') && (
              <>
                {values.feeType === 'CHARGE' && (
                  <DateTimeControl>
                    <DateTimeLabel htmlFor="feeDueDate">
                      입금 마감 기한
                    </DateTimeLabel>
                    <input
                      id="feeDueDate"
                      type="datetime-local"
                      name="feeDueDate"
                      value={values.feeDueDate}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        })
                      }
                      step={600}
                    />
                  </DateTimeControl>
                )}
                <DateTimeControl>
                  <DateTimeLabel htmlFor="startDate">시작 일자</DateTimeLabel>
                  <input
                    id="startDate"
                    type="datetime-local"
                    name="startDate"
                    value={values.startDate}
                    onChange={(e) =>
                      setValues({ ...values, [e.target.name]: e.target.value })
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
                    value={values.endDate}
                    onChange={(e) =>
                      setValues({ ...values, [e.target.name]: e.target.value })
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
                    value={values.dueDate}
                    onChange={(e) =>
                      setValues({ ...values, [e.target.name]: e.target.value })
                    }
                  />
                </DateTimeControl>
                <DateTimeControl>
                  <DateTimeLabel htmlFor="announcementDate">
                    합격자 발표 일자
                  </DateTimeLabel>
                  <input
                    id="announcementDate"
                    type="datetime-local"
                    name="announcementDate"
                    value={values.announcementDate}
                    onChange={(e) =>
                      setValues({ ...values, [e.target.name]: e.target.value })
                    }
                  />
                </DateTimeControl>
              </>
            )}
            {(values.program === 'CHALLENGE' || values.program === 'LIVE') && (
              <>
                <ReactQuill
                  modules={modules}
                  placeholder="상세 내용을 입력해주세요."
                  ref={quillRef}
                  value={content ? content : ''}
                  onChange={(value) => {
                    setContent(value);
                  }}
                />
                <FAQEditor
                  faqList={faqList}
                  faqIdList={faqIdList}
                  onFAQAdd={handleFAQAdd}
                  onFAQDelete={handleFAQDelete}
                  onFAQChange={handleFAQChange}
                  onFAQCheckChange={handleFAQCheckChange}
                />
              </>
            )}
          </>
        )}
        <div className="flex justify-end gap-2">
          <button
            type="submit"
            className="w-20 rounded-xxs bg-indigo-600 py-2 text-center font-medium text-white"
          >
            등록
          </button>
          <button
            type="button"
            className="w-20 rounded-xxs bg-gray-400 py-2 text-center font-medium text-white"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgramEditor;

export const DateTimeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const DateTimeLabel = styled.label`
  font-weight: 500;
  width: 8rem;
`;
