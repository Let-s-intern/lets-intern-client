import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

import {
  usePatchUserAdminMutation,
  useUserDetailAdminQuery,
  UseUserDetailAdminQueryKey,
} from '@/api/user/user';
import {
  useGetAdminUserCareerQuery,
  usePostAdminCareerMutation,
  useDeleteAdminCareerMutation,
} from '@/api/career/career';
import { uploadFile } from '@/api/file';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { useQueryClient } from '@tanstack/react-query';

interface BasicFormData {
  name: string;
  nickname: string;
  phoneNum: string;
  email: string;
  sns: string;
  profileImgUrl: string;
  introduction: string;
}

const INITIAL_FORM: BasicFormData = {
  name: '',
  nickname: '',
  phoneNum: '',
  email: '',
  sns: '',
  profileImgUrl: '',
  introduction: '',
};

const BASIC_FORM_FIELDS = [
  { label: '이름', key: 'name' as const },
  { label: '닉네임', key: 'nickname' as const },
  { label: '이메일', key: 'email' as const },
  { label: '전화번호', key: 'phoneNum' as const },
  { label: 'SNS', key: 'sns' as const },
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
}

export default function AdminMentorDetailPage() {
  const params = useParams<{ mentorId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();
  const mentorId = Number(params.mentorId || 0);

  const { data: userDetail, isLoading } = useUserDetailAdminQuery({
    userId: mentorId,
    enabled: !!mentorId,
  });

  const { data: careerData } = useGetAdminUserCareerQuery(mentorId, {
    page: 0,
    size: 100,
  });

  const patchUser = usePatchUserAdminMutation({
    userId: mentorId,
    successCallback: () => {
      snackbar('프로필이 저장되었습니다.');
      queryClient.invalidateQueries({
        queryKey: [UseUserDetailAdminQueryKey, mentorId],
      });
    },
    errorCallback: () => snackbar('저장에 실패했습니다.'),
  });

  const postCareer = usePostAdminCareerMutation(mentorId);
  const deleteCareer = useDeleteAdminCareerMutation(mentorId);

  const [form, setForm] = useState<BasicFormData>(INITIAL_FORM);

  useEffect(() => {
    if (!userDetail) return;
    const { userInfo } = userDetail;
    setForm({
      name: userInfo.name ?? '',
      nickname: userInfo.nickname ?? '',
      phoneNum: userInfo.phoneNum ?? '',
      email: userInfo.email ?? '',
      sns: userInfo.sns ?? '',
      profileImgUrl: userInfo.profileImgUrl ?? '',
      introduction: userInfo.introduction ?? '',
    });
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
        }))
        .sort((a, b) => b.startDate.localeCompare(a.startDate)),
    [careerData],
  );

  const handleSave = () => {
    patchUser.mutate({
      name: form.name || undefined,
      email: form.email || undefined,
      phoneNum: form.phoneNum || undefined,
      nickname: form.nickname || null,
      sns: form.sns || null,
      profileImgUrl: form.profileImgUrl || null,
      introduction: form.introduction || null,
    });
  };

  const handleAddCareer = () => {
    const formData = new FormData();
    formData.append(
      'requestDto',
      new Blob(
        [
          JSON.stringify({
            company: '회사명',
            job: '직무',
            employmentType: '정규직',
            startDate: new Date().toISOString().slice(0, 7),
            endDate: null,
            field: null,
            position: null,
            department: null,
          }),
        ],
        { type: 'application/json' },
      ),
    );
    postCareer.mutate(formData, {
      onSuccess: () => snackbar('경력이 추가되었습니다.'),
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isFileTooLarge = file.size > 5 * 1024 * 1024;
    if (isFileTooLarge) {
      snackbar('파일 크기는 5MB 이하여야 합니다.');
      return;
    }
    try {
      const fileUrl = await uploadFile({ file, type: 'USER_PROFILE' });
      setForm((prev) => ({ ...prev, profileImgUrl: fileUrl }));
    } catch {
      snackbar('이미지 업로드에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <section className="p-5">
        <div className="text-xsmall14 text-neutral-40 py-16 text-center">
          불러오는 중...
        </div>
      </section>
    );
  }

  if (!userDetail) {
    return (
      <section className="p-5">
        <div className="text-xsmall14 text-neutral-40 py-16 text-center">
          멘토 정보를 찾을 수 없습니다.
        </div>
      </section>
    );
  }

  return (
    <section className="p-5">
      <div className="mb-4 flex items-center gap-4">
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate('/mentors')}
        >
          목록으로
        </Button>
        <Heading>멘토 상세 정보</Heading>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* 기본 정보 */}
        <div className="border-neutral-80 rounded-lg border p-6">
          <h2 className="text-medium18 mb-4 font-semibold">기본 정보</h2>

          <div className="mb-6 flex items-center gap-4">
            <div className="border-neutral-80 bg-neutral-95 relative flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border">
              {form.profileImgUrl ? (
                <img
                  src={form.profileImgUrl}
                  alt="프로필"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xsmall14 text-neutral-40">이미지</span>
              )}
            </div>
            <label className="border-neutral-80 text-xsmall14 hover:bg-neutral-95 cursor-pointer rounded border px-3 py-1.5">
              이미지 업로드
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
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

          <div className="mt-4 flex justify-end">
            <Button
              variant="contained"
              size="small"
              onClick={handleSave}
              disabled={patchUser.isPending}
            >
              {patchUser.isPending ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>

        {/* 경력 사항 */}
        <div className="border-neutral-80 rounded-lg border p-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-medium18 font-semibold">경력사항</h2>
            <Button
              variant="outlined"
              size="small"
              onClick={handleAddCareer}
              disabled={postCareer.isPending}
            >
              경력 추가 +
            </Button>
          </div>
          <p className="text-xxsmall12 text-neutral-40 mb-4">
            멘토가 직접 등록한 경력은 수정/삭제할 수 없습니다.
          </p>

          {careers.length === 0 ? (
            <div className="text-xsmall14 text-neutral-40 py-8 text-center">
              등록된 경력이 없습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {careers.map((career, index) => {
                const isDeletable = career.isAddedByAdmin && career.id;
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
                    {!career.isAddedByAdmin ? (
                      <span className="text-xxsmall12 mt-1 text-neutral-50">
                        멘토 등록
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
