'use client';

import {
  CreateReportData,
  getReportsForAdminQueryKey,
  ReportType,
  usePostReportMutation,
} from '@/api/report';
import AdminReportFeedback from '@/domain/admin/report/AdminReportFeedback';
import ReportProgramRecommendEditor from '@/domain/admin/report/ReportProgramRecommendEditor';
import ReportReviewEditor from '@/domain/admin/report/ReportReviewEditor';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import FaqSection from '@/domain/faq/FaqSection';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';
import { ProgramTypeEnum } from '@/schema';
import { ReportContent, ReportEditingPrice } from '@/types/interface';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { FaTrashCan } from 'react-icons/fa6';
import AdminReportActiveGuide from './AdminReportActiveGuide';

const initialReport: Omit<CreateReportData, 'contents'> = {
  reportType: 'PERSONAL_STATEMENT',
  title: '',
  notice: '',
  priceInfo: [],
  optionInfo: [],
  feedbackInfo: {
    price: 0,
    discountPrice: 0,
  },
  visibleDate: null,
  faqInfo: [],
};

const initialContent = {
  reportExample: { list: [] },
  review: { list: [] },
  reportProgramRecommend: {},
};

const AdminReportCreatePage = () => {
  const router = useRouter();

  const [editingValue, setEditingValue] =
    useState<Omit<CreateReportData, 'contents'>>(initialReport);

  const [editingPrice, setEditingPrice] = useState<ReportEditingPrice>({
    type: 'all',
    basicPrice: 0,
    basicDiscount: 0,
    premiumPrice: 0,
    premiumDiscount: 0,
  });

  const [editingOptions, setEditingOptions] = useState<
    CreateReportData['optionInfo']
  >([]);
  const [content, setContent] = useState<ReportContent>(initialContent);

  const { snackbar: setSnackbar } = useAdminSnackbar();

  const createReportMutation = usePostReportMutation();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      alert('입력값을 확인해주세요.');
      return;
    }

    const body = {
      ...editingValue,
      contents: JSON.stringify(content),
    };

    body.optionInfo = [...editingOptions];

    switch (editingPrice.type) {
      case 'premium':
        body.priceInfo = [
          {
            discountPrice: editingPrice.premiumDiscount,
            price: editingPrice.premiumPrice,
            reportPriceType: 'PREMIUM',
          },
        ];
        break;
      case 'basic':
        body.priceInfo = [
          {
            discountPrice: editingPrice.basicDiscount,
            price: editingPrice.basicPrice,
            reportPriceType: 'BASIC',
          },
        ];
        break;

      case 'all':
        body.priceInfo = [
          {
            discountPrice: editingPrice.basicDiscount,
            price: editingPrice.basicPrice,
            reportPriceType: 'BASIC',
          },
          {
            discountPrice: editingPrice.premiumDiscount,
            price: editingPrice.premiumPrice,
            reportPriceType: 'PREMIUM',
          },
        ];
        break;
    }

    if (!body.visibleDate) {
      delete body.visibleDate;
    }

    console.log('서류진단 생성 요청 body:', body);
    await createReportMutation.mutateAsync({
      ...body,
    });

    queryClient.invalidateQueries({
      queryKey: [getReportsForAdminQueryKey],
    });

    setSnackbar('서류 진단이 생성되었습니다.');

    router.push('/admin/report/list');
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditingValue({
      ...editingValue,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="mx-3 mb-40 mt-3 min-w-[800px]">
      <header>
        <h1 className="text-2xl font-semibold">서류 진단 등록</h1>
      </header>

      <main className="max-w-screen-xl">
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div className="flex-no-wrap flex items-center gap-4"></div>

          {/* 기본 설정 */}
          <section className="flex items-center gap-2">
            <FormControl size="small" className="w-60">
              <InputLabel id="reportType-label">서류 진단 타입</InputLabel>
              <Select<ReportType>
                id="reportType"
                name="reportType"
                label="서류 진단 타입"
                labelId="reportType-label"
                value={editingValue.reportType}
                onChange={(value) => {
                  setEditingValue({
                    ...editingValue,
                    reportType: value.target.value as ReportType,
                  });
                }}
              >
                <MenuItem value="RESUME">이력서</MenuItem>
                <MenuItem value="PERSONAL_STATEMENT">자기소개서</MenuItem>
                <MenuItem value="PORTFOLIO">포트폴리오</MenuItem>
              </Select>
            </FormControl>
            <TextField
              value={editingValue.title}
              onChange={onChange}
              variant="outlined"
              name="title"
              size="small"
              required
              label="제목"
              placeholder="서류 진단 제목을 입력하세요"
              className="w-80"
              InputLabelProps={{
                shrink: true,
                style: { fontSize: '14px' },
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
              <DateTimePicker
                label="노출일시 (없으면 비공개)"
                value={
                  editingValue.visibleDate
                    ? dayjs(editingValue.visibleDate)
                    : null
                }
                onChange={(value) => {
                  if (value?.isValid()) {
                    setEditingValue({
                      ...editingValue,
                      visibleDate: value?.format('YYYY-MM-DDTHH:mm:ss'),
                    });
                  }
                }}
                ampm={false}
                format="YYYY.MM.DD HH:mm"
                slotProps={{
                  textField: {
                    variant: 'outlined',
                    className: 'w-60',
                    size: 'small',
                  },
                }}
                closeOnSelect
              />
            </LocalizationProvider>
            <Button
              className="flex-none"
              variant="outlined"
              onClick={() => {
                setEditingValue((prev) => {
                  if (prev.visibleDate) {
                    return { ...prev, visibleDate: null };
                  }
                  return prev;
                });
              }}
            >
              노출일시 삭제
            </Button>
            <FormControlLabel
              className="pl-4 text-neutral-40"
              control={
                <Checkbox
                  checked={false}
                  // 클릭 시 ALERT
                  onChange={() => {
                    alert(
                      '서류진단 생성 시 비노출 처리됩니다. 노출 설정은 수정을 통해 진행해주세요.',
                    );
                  }}
                  color="primary"
                />
              }
              label="노출 여부"
            />
          </section>

          <AdminReportActiveGuide />

          <hr />

          {/* 가격 설정 */}
          <section>
            <div className="flex gap-4">
              <FormControl size="small" className="w-48">
                <InputLabel id="priceType-label">가격 선택</InputLabel>
                <Select<ReportEditingPrice['type']>
                  id="priceType"
                  className="w-48"
                  name="priceType"
                  label="가격 선택"
                  labelId="priceType-label"
                  value={editingPrice?.type}
                  onChange={(value) => {
                    setEditingPrice((prev) => {
                      return {
                        // 기본값 설정
                        basicPrice: 0,
                        basicDiscount: 0,
                        premiumPrice: 0,
                        premiumDiscount: 0,

                        // 이전 값 복사
                        ...prev,

                        // 선택한 값으로 변경
                        type: value.target.value as ReportEditingPrice['type'],
                      };
                    });
                  }}
                >
                  <MenuItem value="basic">베이직</MenuItem>
                  <MenuItem value="premium">프리미엄</MenuItem>
                  <MenuItem value="all">베이직 + 프리미엄</MenuItem>
                </Select>
              </FormControl>
              {editingPrice.type === 'basic' || editingPrice.type === 'all' ? (
                <div className="flex flex-col gap-2">
                  <TextField
                    value={editingPrice.basicPrice}
                    onChange={(e) => {
                      setEditingPrice((prev) => {
                        return {
                          ...prev,
                          basicPrice: Number(e.target.value),
                        };
                      });
                    }}
                    variant="outlined"
                    name="basicPrice"
                    size="small"
                    label="베이직 가격"
                    placeholder="가격을 입력하세요"
                    InputLabelProps={{
                      shrink: true,
                      style: { fontSize: '14px' },
                    }}
                  />
                  <TextField
                    value={editingPrice.basicDiscount}
                    onChange={(e) => {
                      setEditingPrice((prev) => {
                        return {
                          ...prev,
                          basicDiscount: Number(e.target.value),
                        };
                      });
                    }}
                    variant="outlined"
                    name="basicDiscount"
                    size="small"
                    label="베이직 할인 가격"
                    placeholder="할인 가격을 입력하세요"
                    InputLabelProps={{
                      shrink: true,
                      style: { fontSize: '14px' },
                    }}
                  />
                </div>
              ) : null}

              {editingPrice.type === 'premium' ||
              editingPrice.type === 'all' ? (
                <div className="flex flex-col gap-2">
                  <TextField
                    value={editingPrice.premiumPrice}
                    onChange={(e) => {
                      setEditingPrice((prev) => {
                        return {
                          ...prev,
                          premiumPrice: Number(e.target.value),
                        };
                      });
                    }}
                    variant="outlined"
                    name="premiumPrice"
                    size="small"
                    label="프리미엄 가격"
                    placeholder="가격을 입력하세요"
                    InputLabelProps={{
                      shrink: true,
                      style: { fontSize: '14px' },
                    }}
                  />
                  <TextField
                    value={editingPrice.premiumDiscount}
                    onChange={(e) => {
                      setEditingPrice((prev) => {
                        return {
                          ...prev,
                          premiumDiscount: Number(e.target.value),
                        };
                      });
                    }}
                    variant="outlined"
                    name="premiumDiscount"
                    size="small"
                    label="프리미엄 할인 가격"
                    placeholder="할인 가격을 입력하세요"
                    InputLabelProps={{
                      shrink: true,
                      style: { fontSize: '14px' },
                    }}
                  />
                </div>
              ) : null}
            </div>
          </section>

          <hr />

          <section>
            <div className="mb-2 flex items-center justify-between">
              <Heading2>옵션 설정</Heading2>
              <Button
                variant="outlined"
                onClick={() => {
                  setEditingOptions((prev) => {
                    return [
                      ...prev,
                      { title: '', code: '', discountPrice: 0, price: 0 },
                    ];
                  });
                }}
              >
                옵션 추가
              </Button>
            </div>
            <div className="flex flex-col items-start gap-4">
              {editingOptions.map((option, index) => {
                return (
                  <div className="flex items-center gap-2" key={index}>
                    <span className="w-5">{index + 1}</span>
                    <TextField
                      value={option.title}
                      onChange={(e) => {
                        setEditingOptions((prev) => {
                          return prev.map((item, i) => {
                            if (i === index) {
                              return { ...item, title: e.target.value };
                            }
                            return item;
                          });
                        });
                      }}
                      variant="outlined"
                      size="small"
                      label="옵션 제목"
                      placeholder="옵션 제목을 입력하세요"
                      InputLabelProps={{
                        shrink: true,
                        style: { fontSize: '14px' },
                      }}
                    />
                    <TextField
                      value={option.price}
                      onChange={(e) => {
                        setEditingOptions((prev) => {
                          return prev.map((item, i) => {
                            if (i === index) {
                              return { ...item, price: Number(e.target.value) };
                            }
                            return item;
                          });
                        });
                      }}
                      variant="outlined"
                      name="optionPrice"
                      type="number"
                      size="small"
                      label="옵션 가격"
                      placeholder="옵션 가격을 입력하세요"
                      InputLabelProps={{
                        shrink: true,
                        style: { fontSize: '14px' },
                      }}
                    />

                    <TextField
                      type="number"
                      value={option.discountPrice}
                      onChange={(e) => {
                        setEditingOptions((prev) => {
                          return prev.map((item, i) => {
                            if (i === index) {
                              return {
                                ...item,
                                discountPrice: Number(e.target.value),
                              };
                            }
                            return item;
                          });
                        });
                      }}
                      variant="outlined"
                      name="optionDiscountPrice"
                      size="small"
                      label="옵션 할인 가격"
                      placeholder="할인 가격을 입력하세요"
                      InputLabelProps={{
                        shrink: true,
                        style: { fontSize: '14px' },
                      }}
                    />

                    <TextField
                      value={option.code}
                      onChange={(e) => {
                        setEditingOptions((prev) => {
                          return prev.map((item, i) => {
                            if (i === index) {
                              return { ...item, code: e.target.value };
                            }
                            return item;
                          });
                        });
                      }}
                      variant="outlined"
                      size="small"
                      label="옵션 코드"
                      placeholder="옵션 코드를 입력하세요"
                      InputLabelProps={{
                        shrink: true,
                        style: { fontSize: '14px' },
                      }}
                    />

                    {/* 옵션 삭제 with trash icon */}
                    <Button
                      variant="text"
                      onClick={() => {
                        setEditingOptions((prev) => {
                          return prev.filter((_, i) => i !== index);
                        });
                      }}
                      className="min-w-0"
                      style={{ minWidth: 0, padding: 12 }}
                      color="error"
                    >
                      <FaTrashCan />
                    </Button>
                  </div>
                );
              })}
            </div>
          </section>

          <hr />

          <section>
            <Heading2>1:1 온라인 상담 설정</Heading2>
            <AdminReportFeedback
              initialValue={{
                price: 0,
                discount: 0,
              }}
              onChange={(value) => {
                setEditingValue((prev) => {
                  return {
                    ...prev,
                    feedbackInfo: {
                      price: value.price,
                      discountPrice: value.discount,
                    },
                  };
                });
              }}
            />
          </section>

          <hr />

          {/* 레포트 후기 */}
          <section>
            <ReportReviewEditor
              review={content.review}
              setReview={(review) =>
                setContent((prev) => ({ ...prev, review }))
              }
            />
          </section>

          <hr />

          {/* 프로그램 추천 */}
          <section className="mb-6">
            <ReportProgramRecommendEditor
              reportProgramRecommend={content.reportProgramRecommend}
              setReportProgramRecommend={(reportProgramRecommend) =>
                setContent((prev) => ({ ...prev, reportProgramRecommend }))
              }
            />
          </section>

          <section className="mb-6">
            <FaqSection
              programType={ProgramTypeEnum.enum.REPORT}
              faqInfo={editingValue.faqInfo ?? []}
              setFaqInfo={(faqInfo) =>
                setEditingValue((prev) => ({ ...prev, faqInfo: faqInfo ?? [] }))
              }
              isCreate
            />
          </section>

          <div className="mb-1 flex items-center justify-end gap-4 text-right">
            <Button
              variant="outlined"
              type="button"
              onClick={() => {
                router.push('/admin/report/list');
              }}
            >
              취소 (리스트로 돌아가기)
            </Button>
            <Button variant="contained" color="primary" type="submit">
              등록
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminReportCreatePage;
