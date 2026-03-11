'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@mui/material';

import {
  usePatchUserAdminMutation,
  useUserDetailAdminQuery,
  UseUserDetailAdminQueryKey,
} from '@/api/user/user';
import {
  useGetAdminUserCareerQuery,
  usePostAdminCareerMutation,
  AdminUserCareerQueryKey,
} from '@/api/career/career';
import type { UserCareerType } from '@/api/career/careerSchema';
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

interface LocalCareer {
  id?: number | null;
  company: string;
  job: string;
  field: string;
  position: string;
  department: string;
  startDate: string;
  endDate: string;
}

function buildCareerFormData(career: Omit<UserCareerType, 'id'>): FormData {
  const formData = new FormData();
  formData.append(
    'requestDto',
    new Blob(
      [
        JSON.stringify({
          company: career.company,
          job: career.job,
          employmentType: career.employmentType || '정규직',
          startDate: career.startDate,
          endDate: career.endDate || null,
          field: career.field || null,
          position: career.position || null,
          department: career.department || null,
        }),
      ],
      { type: 'application/json' },
    ),
  );
  return formData;
}

export default function AdminMentorDetailPage() {
  const params = useParams<{ mentorId: string }>();
  const router = useRouter();
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

  const careers: LocalCareer[] = (careerData?.userCareers ?? []).map((c) => ({
    id: c.id,
    company: c.company,
    job: c.job,
    field: c.field ?? '',
    position: c.position ?? '',
    department: c.department ?? '',
    startDate: c.startDate,
    endDate: c.endDate ?? '',
  }));

  const handleSave = useCallback(() => {
    patchUser.mutate({
      name: form.name || undefined,
      email: form.email || undefined,
      phoneNum: form.phoneNum || undefined,
      nickname: form.nickname || null,
      sns: form.sns || null,
      profileImgUrl: form.profileImgUrl || null,
      introduction: form.introduction || null,
    });
  }, [form, patchUser]);

  const handleAddCareer = () => {
    const fd = buildCareerFormData({
      company: '회사명',
      job: '직무',
      employmentType: '정규직',
      startDate: new Date().toISOString().slice(0, 7),
      endDate: null,
      field: null,
      position: null,
      department: null,
    });
    postCareer.mutate(fd, {
      onSuccess: () => snackbar('경력이 추가되었습니다.'),
      onError: () => snackbar('경력 추가에 실패했습니다.'),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
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
        <div className="py-16 text-center text-xsmall14 text-neutral-40">
          불러오는 중...
        </div>
      </section>
    );
  }

  if (!userDetail) {
    return (
      <section className="p-5">
        <div className="py-16 text-center text-xsmall14 text-neutral-40">
          멘토 정보를 찾을 수 없습니다.
        </div>
      </section>
    );
  }

  return (
    <section className="p-5">
      <div className="mb-4 flex items-center gap-4">
        <Button variant="outlined" size="small" onClick={() => router.push('/admin/mentors')}>
          목록으로
        </Button>
        <Heading>멘토 상세 정보</Heading>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* 기본 정보 */}
        <div className="rounded-lg border border-neutral-80 p-6">
          <h2 className="mb-4 text-medium18 font-semibold">기본 정보</h2>

          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-80 bg-neutral-95">
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
            <label className="cursor-pointer rounded border border-neutral-80 px-3 py-1.5 text-xsmall14 hover:bg-neutral-95">
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
            {[
              { label: '이름', key: 'name' as const },
              { label: '닉네임', key: 'nickname' as const },
              { label: '이메일', key: 'email' as const },
              { label: '전화번호', key: 'phoneNum' as const },
              { label: 'SNS', key: 'sns' as const },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center gap-3">
                <label className="w-20 flex-shrink-0 text-xsmall14 font-medium text-neutral-30">
                  {label}
                </label>
                <input
                  type="text"
                  value={form[key]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="flex-1 rounded border border-neutral-80 px-3 py-2 text-xsmall14 outline-none focus:border-neutral-40"
                />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-xsmall14 font-medium text-neutral-30">
              한줄 소개
            </label>
            <textarea
              value={form.introduction}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, introduction: e.target.value }))
              }
              placeholder="한줄 소개를 입력해주세요"
              className="h-24 w-full resize-none rounded border border-neutral-80 px-3 py-2 text-xsmall14 outline-none focus:border-neutral-40"
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
        <div className="rounded-lg border border-neutral-80 p-6">
          <div className="mb-4 flex items-center justify-between">
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

          {careers.length === 0 ? (
            <div className="py-8 text-center text-xsmall14 text-neutral-40">
              등록된 경력이 없습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {careers.map((career, index) => (
                <div
                  key={career.id ?? index}
                  className="rounded border border-neutral-80 p-4"
                >
                  <div className="mb-1 text-xsmall14 font-semibold">
                    경력 {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xsmall14">
                    <div>
                      <span className="text-neutral-40">회사명: </span>
                      {career.company}
                    </div>
                    <div>
                      <span className="text-neutral-40">직무: </span>
                      {career.job}
                    </div>
                    <div>
                      <span className="text-neutral-40">업무분야: </span>
                      {career.field || '-'}
                    </div>
                    <div>
                      <span className="text-neutral-40">직책: </span>
                      {career.position || '-'}
                    </div>
                    <div>
                      <span className="text-neutral-40">부서명: </span>
                      {career.department || '-'}
                    </div>
                    <div>
                      <span className="text-neutral-40">재직 기간: </span>
                      {career.startDate}
                      {career.endDate ? ` ~ ${career.endDate}` : ' ~ 재직중'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
