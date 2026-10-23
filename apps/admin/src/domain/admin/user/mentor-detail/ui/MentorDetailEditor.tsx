import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import {
  useDeleteAdminCareerMutation,
  useGetAdminUserCareerQuery,
  usePatchAdminCareerCompanyLogoMutation,
  usePatchAdminRepresentativeCareerMutation,
  usePatchAdminUserCareerMutation,
  usePostAdminCareerMutation,
} from '@/api/career/career';
import { UserCareerType } from '@/api/career/careerSchema';
import { useAdminCompanyLogoListQuery } from '@/api/company-logo/companyLogo';
import { uploadFile } from '@/api/file';
import {
  useAdminMentorHashTagListQuery,
  usePutAdminMentorHashTagOfMentor,
} from '@/api/mentor/mentor';
import {
  AdminUserDetailQueryKey,
  useAdminUserDetailQuery,
  usePatchAdminUserCorpLogoMutation,
  usePatchUserAdminMutation,
} from '@/api/user/user';
import CareerForm from '@/common/career/CareerForm';
import { DEFAULT_CAREER } from '@/common/career/constants';
import CareerEditDialog, {
  type CareerEditValues,
} from '@/domain/admin/user/mentor-detail/ui/CareerEditDialog';
import CompanyLogoPickerDialog from '@/domain/admin/user/mentor-detail/ui/CompanyLogoPickerDialog';
import MentorDescriptionField from '@/domain/admin/user/mentor-detail/ui/MentorDescriptionField';
import ProfileImageUploadModal from '@/domain/admin/user/mentor-detail/ui/ProfileImageUploadModal';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { parseSnsList, serializeSnsList, toSnsUrl } from '@/utils/sns';
import { useQueryClient } from '@tanstack/react-query';

interface BasicFormData {
  name: string;
  nickname: string;
  phoneNum: string;
  email: string;
  sns: string[];
  profileImgUrl: string;
  corpImgUrl: string;
  /** 대표 로고에 연결한 라이브러리 로고. 직접 올린 로고면 null */
  corpLogoId: number | null;
  introduction: string;
}

const INITIAL_FORM: BasicFormData = {
  name: '',
  nickname: '',
  phoneNum: '',
  email: '',
  sns: [],
  profileImgUrl: '',
  corpImgUrl: '',
  corpLogoId: null,
  introduction: '',
};

const BASIC_FORM_FIELDS = [
  { label: '이름', key: 'name' as const },
  { label: '닉네임', key: 'nickname' as const },
  { label: '이메일', key: 'email' as const },
  { label: '전화번호', key: 'phoneNum' as const },
] as const;

interface LocalCareer {
  id: number | null;
  company: string;
  job: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  field: string;
  position: string;
  department: string;
  isAddedByAdmin: boolean;
  isRepresentative: boolean;
  logoImgUrl: string;
  companyLogoId: number | null;
}

interface Props {
  mentorId: number;
}

/** 경력 날짜는 `2020-01`, `2020.01`, `2020-01-01` 로 올 수 있다. 수정 폼은 `2020-01` 만 쓴다 */
const toYearMonth = (date: string) => date.replace('.', '-').slice(0, 7);

/**
 * 멘토 기본 정보·경력사항·키워드 편집. 멘토 상세 페이지와 1:1 LIVE 멘토링 관리의
 * 멘토 수정 모달이 함께 쓴다.
 */
export default function MentorDetailEditor({ mentorId }: Props) {
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();

  const { data: userDetail, isLoading } = useAdminUserDetailQuery(mentorId);

  const { data: careerData } = useGetAdminUserCareerQuery(mentorId, {
    page: 0,
    size: 100,
  });

  const patchUser = usePatchUserAdminMutation({
    userId: mentorId,
    successCallback: () => {
      snackbar('프로필이 저장되었습니다.');
      queryClient.invalidateQueries({
        queryKey: [AdminUserDetailQueryKey, mentorId],
      });
    },
    errorCallback: () => snackbar('저장에 실패했습니다.'),
  });

  const { data: hashTagList = [] } = useAdminMentorHashTagListQuery();
  const putHashTags = usePutAdminMentorHashTagOfMentor(mentorId);

  const postCareer = usePostAdminCareerMutation(mentorId);
  const deleteCareer = useDeleteAdminCareerMutation(mentorId);
  const patchRepresentative =
    usePatchAdminRepresentativeCareerMutation(mentorId);
  const patchCareer = usePatchAdminUserCareerMutation(mentorId);
  const [editingCareer, setEditingCareer] = useState<LocalCareer | null>(null);
  // 경력 행의 로고 칸에서 바로 바꾸는 경력, 대표로 바꿀지 묻는 경력
  const [logoPickingCareer, setLogoPickingCareer] =
    useState<LocalCareer | null>(null);
  const [representativeTarget, setRepresentativeTarget] =
    useState<LocalCareer | null>(null);
  const [isCareerFormOpen, setIsCareerFormOpen] = useState(false);

  const [form, setForm] = useState<BasicFormData>(INITIAL_FORM);
  // 에디터를 건드리기 전에는 null. 본문을 고치지 않았으면 저장 요청에 넣지 않는다
  const [descriptionDraft, setDescriptionDraft] = useState<string | null>(null);
  const [selectedHashTagIds, setSelectedHashTagIds] = useState<number[]>([]);
  /*
    대표 로고를 직접 올렸는지. 올렸을 때만 corpImgUrl 을 보낸다 — 서버는 corpImgUrl 이 바뀌면
    라이브러리 연결을 끊으므로, 연결된 로고의 주소를 그대로 돌려보내기만 해도 연결이 풀린다.
  */
  const [isCorpImageUploaded, setIsCorpImageUploaded] = useState(false);

  // 연결된 라이브러리 로고의 회사명을 보여 주는 데 쓴다
  const { data: companyLogos = [] } = useAdminCompanyLogoListQuery();
  const logoNameOf = (logoId: number | null) =>
    logoId === null
      ? null
      : (companyLogos.find((logo) => logo.id === logoId)?.name ?? `#${logoId}`);
  const patchCorpLogo = usePatchAdminUserCorpLogoMutation(mentorId);
  const patchCareerLogo = usePatchAdminCareerCompanyLogoMutation(mentorId);

  useEffect(() => {
    if (!userDetail) return;
    const { userInfo } = userDetail;
    setForm({
      name: userInfo.name ?? '',
      nickname: userInfo.nickname ?? '',
      phoneNum: userInfo.phoneNum ?? '',
      email: userInfo.email ?? '',
      sns: parseSnsList(userInfo.sns),
      profileImgUrl: userInfo.profileImgUrl ?? '',
      corpImgUrl: userInfo.corpImgUrl ?? '',
      corpLogoId: userInfo.corpLogoId ?? null,
      introduction: userInfo.introduction ?? '',
    });
    setIsCorpImageUploaded(false);
    setSelectedHashTagIds(
      (userDetail.mentorHashTagInfos ?? []).map((tag) => tag.id),
    );
  }, [userDetail]);

  const careers: LocalCareer[] = useMemo(
    () =>
      (careerData?.userCareers ?? [])
        .map((c) => ({
          id: c.id ?? null,
          company: c.company,
          job: c.job,
          employmentType: c.employmentType ?? '',
          startDate: c.startDate ?? '',
          endDate: c.endDate ?? '',
          field: c.field ?? '',
          position: c.position ?? '',
          department: c.department ?? '',
          isAddedByAdmin: c.isAddedByAdmin ?? false,
          isRepresentative: c.isRepresentative ?? false,
          logoImgUrl: c.logoImgUrl ?? '',
          companyLogoId: c.companyLogoId ?? null,
        }))
        .sort((a, b) => b.startDate.localeCompare(a.startDate)),
    [careerData],
  );

  const handleSave = () => {
    // 도메인만 쓴 SNS 는 https:// 를 붙여 보내고, 주소 형식이 아니면 저장하지 않는다 (LC-3307)
    const snsUrls = form.sns
      .filter((value) => value.trim() !== '')
      .map(toSnsUrl);
    const validSnsUrls = snsUrls.filter((url): url is string => url !== null);
    if (validSnsUrls.length !== snsUrls.length) {
      snackbar('SNS 주소를 확인해 주세요.');
      return;
    }

    // 같은 시간에 멘토가 고친 본문을 덮지 않도록, 본문은 바뀐 경우에만 보낸다
    const isDescriptionChanged =
      descriptionDraft !== null &&
      descriptionDraft !== userDetail?.userInfo.description;
    // 한줄소개도 바뀐 경우에만 보낸다. 원래 null 인 멘토가 다른 필드 저장만으로 '' 가 되지 않게 한다.
    // 비워서 바꿨으면 '' 를 그대로 보낸다(null 은 서버가 기존 값을 유지한다)
    const isIntroductionChanged =
      form.introduction !== (userDetail?.userInfo.introduction ?? '');

    patchUser.mutate({
      name: form.name || undefined,
      email: form.email || undefined,
      phoneNum: form.phoneNum || undefined,
      nickname: form.nickname || null,
      sns: serializeSnsList(validSnsUrls),
      profileImgUrl: form.profileImgUrl || null,
      ...(isCorpImageUploaded ? { corpImgUrl: form.corpImgUrl } : {}),
      ...(isIntroductionChanged ? { introduction: form.introduction } : {}),
      ...(isDescriptionChanged ? { description: descriptionDraft } : {}),
    });

    // 직접 올렸으면 서버가 연결을 이미 끊는다. 그 밖에 연결이 바뀌었을 때만 따로 보낸다
    const savedCorpLogoId = userDetail?.userInfo.corpLogoId ?? null;
    if (!isCorpImageUploaded && form.corpLogoId !== savedCorpLogoId) {
      patchCorpLogo.mutate(form.corpLogoId, {
        onError: () => snackbar('대표 로고 연결에 실패했습니다.'),
      });
    }

    const savedHashTagIds = (userDetail?.mentorHashTagInfos ?? []).map(
      (tag) => tag.id,
    );
    const isHashTagChanged =
      savedHashTagIds.length !== selectedHashTagIds.length ||
      savedHashTagIds.some((id) => !selectedHashTagIds.includes(id));
    if (isHashTagChanged) {
      putHashTags.mutate(
        { mentorHashTagIdList: selectedHashTagIds },
        {
          onSuccess: () =>
            queryClient.invalidateQueries({
              queryKey: [AdminUserDetailQueryKey, mentorId],
            }),
          onError: () => snackbar('키워드 저장에 실패했습니다.'),
        },
      );
    }
  };

  const handleHashTagToggle = (hashTagId: number) => {
    setSelectedHashTagIds((prev) =>
      prev.includes(hashTagId)
        ? prev.filter((id) => id !== hashTagId)
        : [...prev, hashTagId],
    );
  };

  const handleSnsChange = (index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      sns: prev.sns.map((v, i) => (i === index ? value : v)),
    }));
  };

  const handleSnsAdd = () => {
    setForm((prev) => ({ ...prev, sns: [...prev.sns, ''] }));
  };

  const handleSnsRemove = (index: number) => {
    setForm((prev) => ({
      ...prev,
      sns: prev.sns.filter((_, i) => i !== index),
    }));
  };

  const handleAddCareer = (career: UserCareerType) => {
    const formData = new FormData();
    formData.append(
      'requestDto',
      new Blob([JSON.stringify(career)], { type: 'application/json' }),
    );
    postCareer.mutate(formData, {
      onSuccess: () => {
        setIsCareerFormOpen(false);
        snackbar('경력이 추가되었습니다.');
      },
      onError: () => snackbar('경력 추가에 실패했습니다.'),
    });
  };

  const handleDeleteCareer = (career: LocalCareer) => {
    if (!career.id) return;
    if (!window.confirm('이 경력을 삭제하시겠습니까?')) return;
    deleteCareer.mutate(career.id, {
      onSuccess: () => snackbar('경력이 삭제되었습니다.'),
      onError: () => snackbar('경력 삭제에 실패했습니다.'),
    });
  };

  // 지정은 다른 필드 저장과 별개로 바로 반영한다. 웹 멘토 카드의 회사·직무가 이 경력으로 바뀐다
  const handleSetRepresentative = (career: LocalCareer) => {
    if (!career.id) return;
    patchRepresentative.mutate(career.id, {
      onSuccess: () => snackbar('대표 경력으로 지정했습니다.'),
      onError: () => snackbar('대표 경력 지정에 실패했습니다.'),
    });
  };

  // 로고 칸에서 고르면 수정 다이얼로그 없이 바로 연결한다
  const handleChangeCareerLogo = (companyLogoId: number | null) => {
    const career = logoPickingCareer;
    setLogoPickingCareer(null);
    if (!career?.id) return;
    patchCareerLogo.mutate(
      { careerId: career.id, companyLogoId },
      { onError: () => snackbar('경력 로고를 바꾸지 못했습니다.') },
    );
  };

  const handleUpdateCareer = (values: CareerEditValues) => {
    const career = editingCareer;
    if (!career?.id) return;
    const requestDto = {
      company: values.company.trim(),
      job: values.job.trim(),
      field: values.field.trim(),
      position: values.position.trim(),
      department: values.department.trim(),
      employmentType: values.employmentType,
      startDate: values.startDate,
      // 서버는 null 이면 기존 값을 유지한다. 재직 중으로 되돌리는 수정은 아직 안 된다
      endDate: values.endDate || null,
    };
    const formData = new FormData();
    formData.append(
      'requestDto',
      new Blob([JSON.stringify(requestDto)], { type: 'application/json' }),
    );
    patchCareer.mutate(
      { careerId: career.id, careerData: formData },
      {
        onSuccess: () => {
          setEditingCareer(null);
          snackbar('경력이 수정되었습니다.');
          // 로고는 경력 본문이 아니라 라이브러리 연결로 따로 저장한다. 바뀐 경우만
          if (career.id && values.companyLogoId !== career.companyLogoId) {
            patchCareerLogo.mutate(
              { careerId: career.id, companyLogoId: values.companyLogoId },
              { onError: () => snackbar('경력 로고 연결에 실패했습니다.') },
            );
          }
          if (values.isRepresentative && !career.isRepresentative) {
            handleSetRepresentative(career);
          }
        },
        onError: () => snackbar('경력 수정에 실패했습니다.'),
      },
    );
  };

  // 멘토 앱과 같은 블러·영역 선택 모달로 올린다. 업로드만 하고 반영은 아래 저장 버튼이 한다
  const [isProfileUploadOpen, setIsProfileUploadOpen] = useState(false);
  const [isLogoPickerOpen, setIsLogoPickerOpen] = useState(false);

  const handleCorpImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isFileTooLarge = file.size > 5 * 1024 * 1024;
    if (isFileTooLarge) {
      snackbar('파일 크기는 5MB 이하여야 합니다.');
      return;
    }
    try {
      const fileUrl = await uploadFile({ file, type: 'USER_PROFILE' });
      setForm((prev) => ({ ...prev, corpImgUrl: fileUrl, corpLogoId: null }));
      setIsCorpImageUploaded(true);
    } catch {
      snackbar('이미지 업로드에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="text-xsmall14 text-neutral-40 py-16 text-center">
        불러오는 중...
      </div>
    );
  }

  if (!userDetail) {
    return (
      <div className="text-xsmall14 text-neutral-40 py-16 text-center">
        멘토 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* 기본 정보 */}
      <div className="border-neutral-80 rounded-lg border p-6">
        <h2 className="text-medium18 mb-4 font-semibold">기본 정보</h2>

        <div className="mb-10 flex items-center gap-5">
          <div className="flex w-[200px] flex-col">
            <label className="text-xsmall14 text-neutral-30 mb-1 block w-20 font-medium">
              프로필 이미지
            </label>
            <button
              type="button"
              onClick={() => setIsProfileUploadOpen(true)}
              aria-label="프로필 이미지 업로드"
              className="border-neutral-80 bg-neutral-95 group relative flex h-40 w-40 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border"
            >
              {form.profileImgUrl ? (
                <img
                  src={form.profileImgUrl}
                  alt="멘토 프로필"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xsmall14 text-neutral-40">프로필</span>
              )}
              <div className="text-xxsmall12 absolute inset-0 flex items-center justify-center bg-black/50 text-center text-white opacity-0 transition-opacity group-hover:opacity-100">
                이미지
                <br />
                업로드
              </div>
            </button>
            <ProfileImageUploadModal
              isOpen={isProfileUploadOpen}
              onClose={() => setIsProfileUploadOpen(false)}
              onUploaded={(url) =>
                setForm((prev) => ({ ...prev, profileImgUrl: url }))
              }
            />
          </div>
          <div className="item-center flex h-[184px] w-[200px] flex-col">
            <label className="text-xsmall14 text-neutral-30 mb-1 block w-20 font-medium">
              로고 이미지
            </label>
            <label className="border-neutral-80 bg-neutral-95 group relative flex h-20 w-20 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border">
              {form.corpImgUrl ? (
                <img
                  src={form.corpImgUrl}
                  alt="로고"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xsmall14 text-neutral-40">로고</span>
              )}
              <div className="text-xxsmall12 absolute inset-0 flex items-center justify-center bg-black/50 text-center text-white opacity-0 transition-opacity group-hover:opacity-100">
                이미지
                <br />
                업로드
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleCorpImageUpload}
                className="hidden"
              />
            </label>
            <div className="mt-2 flex flex-col items-start gap-1">
              <Button
                variant="outlined"
                size="small"
                onClick={() => setIsLogoPickerOpen(true)}
              >
                라이브러리에서 선택
              </Button>
              {form.corpLogoId !== null ? (
                <div className="text-xxsmall12 text-neutral-30 flex items-center gap-2">
                  <span>라이브러리: {logoNameOf(form.corpLogoId)}</span>
                  <button
                    type="button"
                    className="text-primary underline"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, corpLogoId: null }))
                    }
                  >
                    연결 해제
                  </button>
                </div>
              ) : null}
            </div>
            {isLogoPickerOpen ? (
              <CompanyLogoPickerDialog
                onClose={() => setIsLogoPickerOpen(false)}
                onSelect={(logo) => {
                  setForm((prev) => ({
                    ...prev,
                    corpImgUrl: logo.imageUrl,
                    corpLogoId: logo.id,
                  }));
                  setIsCorpImageUploaded(false);
                  setIsLogoPickerOpen(false);
                }}
              />
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {BASIC_FORM_FIELDS.map(({ label, key }) => (
            <div key={key} className="flex items-center gap-3">
              <label className="text-xsmall14 text-neutral-30 w-20 flex-shrink-0 font-medium">
                {label}
              </label>
              <input
                type="text"
                value={form[key]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className="border-neutral-80 text-xsmall14 focus:border-neutral-40 flex-1 rounded border px-3 py-2 outline-none"
              />
            </div>
          ))}

          {/* SNS (여러 개 입력 가능) */}
          <div className="flex items-start gap-3">
            <label className="text-xsmall14 text-neutral-30 w-20 flex-shrink-0 pt-2 font-medium">
              SNS
            </label>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              {form.sns.map((url, index) => {
                // 빈 줄은 저장할 때 빠지므로 오류로 보지 않는다
                const isInvalid = url.trim() !== '' && toSnsUrl(url) === null;
                return (
                  <div key={index}>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => handleSnsChange(index, e.target.value)}
                        placeholder="https://..."
                        aria-invalid={isInvalid}
                        className="border-neutral-80 text-xsmall14 focus:border-neutral-40 min-w-0 flex-1 rounded border px-3 py-2 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSnsRemove(index)}
                        aria-label="SNS 삭제"
                        className="flex-shrink-0 p-1 opacity-60 transition-opacity hover:opacity-100"
                      >
                        <img
                          src="/icons/x.svg"
                          alt=""
                          className="h-[18px] w-[18px]"
                        />
                      </button>
                    </div>
                    {isInvalid ? (
                      <p
                        role="alert"
                        className="text-system-error mt-1 text-xs"
                      >
                        주소 형식이 아니에요. 예) instagram.com/아이디
                      </p>
                    ) : null}
                  </div>
                );
              })}
              <button
                type="button"
                onClick={handleSnsAdd}
                className="text-primary text-xsmall14 border-neutral-80 hover:bg-neutral-95 w-full rounded border border-dashed px-3 py-2 font-medium"
              >
                + 추가
              </button>
            </div>
          </div>

          {/* 멘토 키워드. 멘토 앱에서 멘토가 고르는 것과 같은 키워드 */}
          <div className="flex items-start gap-3">
            <label className="text-xsmall14 text-neutral-30 w-20 flex-shrink-0 pt-1.5 font-medium">
              멘토 키워드
            </label>
            {hashTagList.length === 0 ? (
              <span className="text-xsmall14 text-neutral-40 pt-1.5">
                등록된 키워드가 없습니다.
              </span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {hashTagList.map((tag) => {
                  const isSelected = selectedHashTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => handleHashTagToggle(tag.id)}
                      className={`text-xxsmall12 rounded-full border px-2.5 py-1.5 ${
                        isSelected
                          ? 'border-primary text-primary font-medium'
                          : 'border-neutral-80 text-neutral-30'
                      }`}
                    >
                      #{tag.title}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xsmall14 text-neutral-30 mb-1 block font-medium">
            한줄 소개
          </label>
          <textarea
            value={form.introduction}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, introduction: e.target.value }))
            }
            placeholder="한줄 소개를 입력해주세요"
            className="border-neutral-80 text-xsmall14 focus:border-neutral-40 h-24 w-full resize-none rounded border px-3 py-2 outline-none"
          />
        </div>

        <MentorDescriptionField
          key={mentorId}
          initialDescription={userDetail.userInfo.description}
          onChange={setDescriptionDraft}
        />

        <div className="mt-4 flex justify-end">
          <Button
            variant="contained"
            size="small"
            onClick={handleSave}
            disabled={patchUser.isPending || putHashTags.isPending}
          >
            {patchUser.isPending ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>

      {/* 경력 사항 */}
      <div className="flex flex-col gap-8">
        <div className="border-neutral-80 rounded-lg border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-medium18 font-semibold">경력사항</h2>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setIsCareerFormOpen(true)}
              disabled={isCareerFormOpen}
            >
              경력 추가 +
            </Button>
          </div>

          {isCareerFormOpen ? (
            <div className="mb-4">
              <CareerForm
                initialCareer={DEFAULT_CAREER}
                handleCancel={() => setIsCareerFormOpen(false)}
                handleSubmit={handleAddCareer}
              />
            </div>
          ) : null}

          {editingCareer ? (
            <CareerEditDialog
              key={editingCareer.id}
              initialValues={{
                company: editingCareer.company,
                job: editingCareer.job,
                field: editingCareer.field,
                position: editingCareer.position,
                department: editingCareer.department,
                employmentType: editingCareer.employmentType,
                startDate: toYearMonth(editingCareer.startDate),
                endDate: toYearMonth(editingCareer.endDate),
                companyLogoId: editingCareer.companyLogoId,
                logoImgUrl: editingCareer.logoImgUrl,
                logoName: logoNameOf(editingCareer.companyLogoId),
                isRepresentative: editingCareer.isRepresentative,
              }}
              isSaving={patchCareer.isPending}
              onClose={() => setEditingCareer(null)}
              onSubmit={handleUpdateCareer}
            />
          ) : null}

          {careers.length === 0 ? (
            <div className="text-xsmall14 text-neutral-40 py-8 text-center">
              등록된 경력이 없습니다.
            </div>
          ) : (
            <div className="flex max-h-[28rem] flex-col gap-3 overflow-y-auto">
              {careers.map((career, index) => {
                const isDeletable = career.id !== null;
                const hasDetails =
                  career.field || career.position || career.department;
                const isLogoSaving =
                  patchCareerLogo.isPending &&
                  patchCareerLogo.variables?.careerId === career.id;
                return (
                  <div
                    key={career.id ?? index}
                    className="border-neutral-80 flex w-full gap-3 rounded border p-4"
                  >
                    {/* 로고 칸을 누르면 수정 다이얼로그 없이 로고만 바로 바꾼다 */}
                    <button
                      type="button"
                      aria-label={`${career.company || '경력'} 경력 로고 변경`}
                      disabled={!career.id || isLogoSaving}
                      onClick={() => setLogoPickingCareer(career)}
                      className={`group relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded ${
                        career.logoImgUrl
                          ? 'border-neutral-80 border'
                          : 'border-neutral-70 border border-dashed'
                      }`}
                    >
                      {career.logoImgUrl ? (
                        <img
                          src={career.logoImgUrl}
                          alt="경력 로고"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-xxsmall10 text-neutral-40">
                          없음
                        </span>
                      )}
                      <span
                        className={`text-xxsmall10 absolute inset-0 flex items-center justify-center bg-black/50 text-center leading-tight text-white transition-opacity ${
                          isLogoSaving
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                        }`}
                      >
                        {isLogoSaving ? '저장 중' : '로고 변경'}
                      </span>
                    </button>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xsmall14 text-neutral-0 flex items-center gap-2">
                          {career.job || '-'}
                          {career.companyLogoId !== null ? (
                            <span className="text-xxsmall12 text-neutral-40">
                              라이브러리: {logoNameOf(career.companyLogoId)}
                            </span>
                          ) : null}
                        </span>
                        {isDeletable ? (
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setEditingCareer(career)}
                              className="text-xxsmall12 text-primary hover:underline"
                            >
                              수정
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCareer(career)}
                              className="text-xxsmall12 text-red-500 hover:text-red-700"
                            >
                              삭제
                            </button>
                          </div>
                        ) : null}
                      </div>
                      <div className="text-xsmall14 text-neutral-0 font-medium">
                        {career.company || '-'}
                      </div>
                      <div className="text-xsmall14 text-neutral-0 flex items-center gap-2">
                        <span>{career.employmentType || '-'}</span>
                        <span className="text-neutral-40">
                          {career.startDate || '-'}
                          {career.endDate
                            ? ` - ${career.endDate}`
                            : ' - 재직중'}
                        </span>
                      </div>
                      {isDeletable && !career.isRepresentative ? (
                        <button
                          type="button"
                          onClick={() => setRepresentativeTarget(career)}
                          disabled={patchRepresentative.isPending}
                          className="text-xxsmall12 text-primary w-fit hover:underline"
                        >
                          대표로 지정
                        </button>
                      ) : null}
                      {hasDetails ? (
                        <div className="text-xsmall14 text-neutral-35 mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                          {career.field ? (
                            <span>업무분야: {career.field}</span>
                          ) : null}
                          {career.position ? (
                            <span>직책: {career.position}</span>
                          ) : null}
                          {career.department ? (
                            <span>부서: {career.department}</span>
                          ) : null}
                        </div>
                      ) : null}
                      {!career.isAddedByAdmin || career.isRepresentative ? (
                        <div className="mt-1 flex items-center gap-1.5">
                          {!career.isAddedByAdmin ? (
                            <span className="text-xxsmall12 text-neutral-50">
                              멘토 등록
                            </span>
                          ) : null}
                          {career.isRepresentative ? (
                            <span className="text-xxsmall12 border-neutral-70 text-neutral-40 rounded-full border px-2 py-0.5">
                              대표 경력
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {logoPickingCareer ? (
        <CompanyLogoPickerDialog
          onClose={() => setLogoPickingCareer(null)}
          onSelect={(logo) => handleChangeCareerLogo(logo.id)}
          onClear={
            logoPickingCareer.logoImgUrl
              ? () => handleChangeCareerLogo(null)
              : undefined
          }
        />
      ) : null}

      <Dialog
        open={representativeTarget !== null}
        onClose={() => setRepresentativeTarget(null)}
      >
        <DialogTitle className="text-base font-semibold">
          대표 경력 지정
        </DialogTitle>
        <DialogContent>
          이 경력을 대표 경력으로 바꿀까요? 웹 멘토 카드의 회사·직무가 바뀝니다.
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setRepresentativeTarget(null)}>
            취소
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (representativeTarget) {
                handleSetRepresentative(representativeTarget);
              }
              setRepresentativeTarget(null);
            }}
          >
            대표로 지정
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
