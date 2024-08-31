import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { FaTrashCan } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import {
  CreateReportData,
  ReportType,
  usePostReportMutation,
} from '../../../api/report';
import EditorApp from '../../../components/admin/lexical/EditorApp';

type EditingPrice =
  | {
      type: 'premium';
      premiumPrice: number;
      premiumDiscount: number;
    }
  | {
      type: 'basic';
      basicPrice: number;
      basicDiscount: number;
    }
  | {
      type: 'all';
      basicPrice: number;
      basicDiscount: number;
      premiumPrice: number;
      premiumDiscount: number;
    };

type EditingFeedbackPrice = {
  type: 'basic';
  price: number;
  discount: number;
};

const initialReport: CreateReportData = {
  reportType: 'PERSONAL_STATEMENT',
  title: '',
  contents: '',
  notice: '',
  priceInfo: [],
  optionInfo: [],
  feedbackInfo: {
    price: 0,
    discountPrice: 0,
  },
  visibleDate: null,
};

const AdminReportCreatePage = () => {
  const navgiate = useNavigate();

  const [editingValue, setEditingValue] =
    useState<CreateReportData>(initialReport);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: '',
  });

  const [editingPrice, setEditingPrice] = useState<EditingPrice>({
    type: 'all',
    basicPrice: 0,
    basicDiscount: 0,
    premiumPrice: 0,
    premiumDiscount: 0,
  });

  const [editingFeedbackPrice, setEditingFeedbackPrice] =
    useState<EditingFeedbackPrice>({
      type: 'basic',
      price: 0,
      discount: 0,
    });

  const [editingOptions, setEditingOptions] = useState<
    CreateReportData['optionInfo']
  >([]);

  const createReportMutation = usePostReportMutation();

  useEffect(() => {
    console.log('editingValue', editingValue);
  }, [editingValue]);

  const postReport = async (event: MouseEvent<HTMLButtonElement>) => {
    const { name } = event.target as HTMLButtonElement;

    const body = {
      ...editingValue,
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

    // body.visibleDate =
    //   name === 'publish' ? dayjs().format('YYYY-MM-DDTHH:mm') : null;

    if (!body.visibleDate) {
      delete body.visibleDate;
    }

    createReportMutation.mutateAsync({
      ...body,
    });

    setSnackbar({
      open: true,
      message: '서류 진단이 생성되었습니다.',
    });

    // navgiate('/admin/report/list');
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditingValue({
      ...editingValue,
      [event.target.name]: event.target.value,
    });
  };

  const onChangeEditor = (jsonString: string) => {
    setEditingValue((prev) => ({ ...prev, contents: jsonString }));
  };

  return (
    <div className="mx-3 mb-40 mt-3">
      <header>
        <h1 className="text-2xl font-semibold">서류 진단 등록</h1>
      </header>
      <main className="max-w-screen-xl">
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex-no-wrap flex items-center gap-4"></div>

          <div className="flex items-center gap-2">
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
              label="제목"
              placeholder="서류 진단 제목을 입력하세요"
              className="w-96"
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
                  setEditingValue({
                    ...editingValue,
                    visibleDate: value?.toISOString(),
                  });
                }}
                ampm={false}
                format="YYYY년 MM월 DD일 HH:mm"
                slotProps={{
                  textField: {
                    variant: 'outlined',
                    className: 'w-72',
                    size: 'small',
                  },
                }}
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
              비공개 처리
            </Button>
          </div>
          <hr></hr>
          <div>
            <div className="flex gap-4">
              <FormControl size="small" className="w-48">
                <InputLabel id="priceType-label">가격 선택</InputLabel>
                <Select<EditingPrice['type']>
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
                        type: value.target.value as EditingPrice['type'],
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
          </div>
          <hr></hr>
          <header className="mb-2 flex items-center justify-between">
            <h2>옵션 설정</h2>
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
          </header>

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

          <hr></hr>
          <div className="flex gap-4">
            <FormControl size="small" className="w-48">
              <InputLabel id="feedback-price-type-label">
                1:1 피드백 가격설정
              </InputLabel>
              <Select<EditingFeedbackPrice['type']>
                id="feedback-price-type"
                className="w-48"
                name="feedback-price-type"
                label="1:1 피드백 가격설정"
                labelId="feedback-price-type-label"
                value="basic"
                // onChange={(value) => {
                //   setEditingFeedbackPrice((prev) => {
                //     return {
                //       type: value.target.value as EditingFeedbackPrice['type'],
                //       price: 0,
                //       discount: 0,
                //     };
                //   });
                // }}
              >
                <MenuItem value="basic">기본</MenuItem>
              </Select>
            </FormControl>
            <div className="flex flex-col items-start gap-2">
              <TextField
                value={editingValue.feedbackInfo.price}
                onChange={(e) => {
                  setEditingValue((prev) => {
                    return {
                      ...prev,
                      feedbackInfo: {
                        ...prev.feedbackInfo,
                        price: Number(e.target.value),
                      },
                    };
                  });
                }}
                variant="outlined"
                name="feedbackPrice"
                size="small"
                label="피드백 가격"
                placeholder="가격을 입력하세요"
                InputLabelProps={{
                  shrink: true,
                  style: { fontSize: '14px' },
                }}
              />
              <TextField
                value={editingValue.feedbackInfo.discountPrice}
                onChange={(e) => {
                  setEditingValue((prev) => {
                    return {
                      ...prev,
                      feedbackInfo: {
                        ...prev.feedbackInfo,
                        discountPrice: Number(e.target.value),
                      },
                    };
                  });
                }}
                variant="outlined"
                name="feedbackDiscountPrice"
                size="small"
                label="피드백 할인 가격"
                placeholder="할인 가격을 입력하세요"
                InputLabelProps={{
                  shrink: true,
                  style: { fontSize: '14px' },
                }}
              />
            </div>
          </div>

          <h2 className="mt-10">콘텐츠 편집</h2>
          <EditorApp onChange={onChangeEditor} />
          <TextField
            value={editingValue.notice}
            onChange={onChange}
            variant="outlined"
            name="notice"
            size="small"
            label="필독사항"
            placeholder="필독사항을 입력하세요"
            InputLabelProps={{
              shrink: true,
              style: { fontSize: '14px' },
            }}
          />

          <div className="text-right">
            <div className="mb-1 flex items-center justify-end gap-4">
              <Button
                variant="outlined"
                type="button"
                onClick={() => {
                  navgiate('/admin/report/list');
                }}
              >
                취소 (리스트로 돌아가기)
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="button"
                name="publish"
                onClick={postReport}
              >
                등록
              </Button>
            </div>
            <span className="text-0.875 text-neutral-35">
              *발행: 서류 진단이 바로 게시됩니다.
            </span>
          </div>
        </div>
      </main>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </div>
  );
};

export default AdminReportCreatePage;
