import { Button } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import {
  useDeleteAdminCareerMutation,
  useGetAdminUserCareerQuery,
  usePostAdminCareerMutation,
} from '@/api/career/career';
import { UserCareerType } from '@/api/career/careerSchema';
import { uploadFile } from '@/api/file';
import {
  useAdminMentorHashTagListQuery,
  usePutAdminMentorHashTagOfMentor,
} from '@/api/mentor/mentor';
import {
  AdminUserDetailQueryKey,
  useAdminUserDetailQuery,
  usePatchUserAdminMutation,
} from '@/api/user/user';
import CareerForm from '@/common/career/CareerForm';
import { DEFAULT_CAREER } from '@/common/career/constants';
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
}

interface Props {
  mentorId: number;
}

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
  const [isCareerFormOpen, setIsCareerFormOpen] = useState(false);

  const [form, setForm] = useState<BasicFormData>(INITIAL_FORM);
  // 에디터를 건드리기 전에는 null. 본문을 고치지 않았으면 저장 요청에 넣지 않는다
  const [descriptionDraft, setDescriptionDraft] = useState<string | null>(null);
  const [selectedHashTagIds, setSelectedHashTagIds] = useState<number[]>([]);

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
      introduction: userInfo.introduction ?? '',
    });
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

    patchUser.mutate({
      name: form.name || undefined,
      email: form.email || undefined,
      phoneNum: form.phoneNum || undefined,
      nickname: form.nickname || null,
      sns: serializeSnsList(validSnsUrls),
      profileImgUrl: form.profileImgUrl || null,
      corpImgUrl: form.corpImgUrl || null,
      // null 은 서버가 기존 값을 유지하므로, 비운 한줄소개는 빈 문자열로 보내야 지워진다
      introduction: form.introduction,
      ...(isDescriptionChanged ? { description: descriptionDraft } : {}),
    });

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

  // 멘토 앱과 같은 블러·영역 선택 모달로 올린다. 업로드만 하고 반영은 아래 저장 버튼이 한다
  const [isProfileUploadOpen, setIsProfileUploadOpen] = useState(false);

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
      setForm((prev) => ({ ...prev, corpImgUrl: fileUrl }));
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
                return (
                  <div
                    key={career.id ?? index}
                    className="border-neutral-80 flex w-full flex-col gap-1 rounded border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xsmall14 text-neutral-0">
                        {career.job || '-'}
                      </span>
                      {isDeletable ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteCareer(career)}
                          className="text-xxsmall12 text-red-500 hover:text-red-700"
                        >
                          삭제
                        </button>
                      ) : null}
                    </div>
                    <div className="text-xsmall14 text-neutral-0 font-medium">
                      {career.company || '-'}
                    </div>
                    <div className="text-xsmall14 text-neutral-0 flex items-center gap-2">
                      <span>{career.employmentType || '-'}</span>
                      <span className="text-neutral-40">
                        {career.startDate || '-'}
                        {career.endDate ? ` - ${career.endDate}` : ' - 재직중'}
                      </span>
                    </div>
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
