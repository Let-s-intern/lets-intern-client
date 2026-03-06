'use client';

import { useState } from 'react';

import {
  useGetUserCareerQuery,
  usePostUserCareerMutation,
  usePatchUserCareerMutation,
  useDeleteUserCareerMutation,
} from '@/api/career/career';
import type { UserCareerType } from '@/api/career/careerSchema';

function buildFormData(career: Omit<UserCareerType, 'id'>): FormData {
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

const EMPTY_CAREER: LocalCareer = {
  company: '',
  job: '',
  field: '',
  position: '',
  department: '',
  startDate: '',
  endDate: '',
};

export default function CareerSection() {
  const { data: careerData, isLoading } = useGetUserCareerQuery({
    page: 0,
    size: 100,
  });
  const { mutate: postCareer } = usePostUserCareerMutation();
  const { mutate: patchCareer } = usePatchUserCareerMutation();
  const { mutate: deleteCareer } = useDeleteUserCareerMutation();

  const serverCareers: LocalCareer[] = (careerData?.userCareers ?? []).map(
    (c) => ({
      id: c.id,
      company: c.company,
      job: c.job,
      field: c.field ?? '',
      position: c.position ?? '',
      department: c.department ?? '',
      startDate: c.startDate,
      endDate: c.endDate ?? '',
    }),
  );

  const handleAdd = () => {
    const fd = buildFormData({
      company: '새 경력',
      job: '',
      employmentType: '정규직',
      startDate: new Date().toISOString().slice(0, 7),
      field: null,
      position: null,
      department: null,
    });
    postCareer(fd);
  };

  const handleDelete = (career: LocalCareer) => {
    if (!career.id) return;
    if (!window.confirm('이 경력을 삭제하시겠습니까?')) return;
    deleteCareer(career.id);
  };

  const handleFieldBlur = (career: LocalCareer) => {
    if (!career.id) return;
    const fd = buildFormData({
      company: career.company,
      job: career.job,
      employmentType: '정규직',
      startDate: career.startDate || new Date().toISOString().slice(0, 7),
      endDate: career.endDate || null,
      field: career.field || null,
      position: career.position || null,
      department: career.department || null,
    });
    patchCareer({ careerId: career.id, careerData: fd });
  };

  if (isLoading) {
    return (
      <section>
        <h2 className="text-lg font-semibold">경력사항</h2>
        <div className="py-4 text-sm text-gray-400">로딩 중...</div>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">경력사항</h2>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
        >
          경력 추가하기 +
        </button>
      </div>

      {serverCareers.length === 0 ? (
        <div className="rounded border border-gray-200 py-8 text-center text-sm text-gray-400">
          등록된 경력이 없습니다. 경력을 추가해주세요.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {serverCareers.map((career, index) => (
            <CareerCard
              key={career.id ?? index}
              career={career}
              index={index}
              onBlur={handleFieldBlur}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function CareerCard({
  career: initialCareer,
  index,
  onBlur,
  onDelete,
}: {
  career: LocalCareer;
  index: number;
  onBlur: (career: LocalCareer) => void;
  onDelete: (career: LocalCareer) => void;
}) {
  const [career, setCareer] = useState(initialCareer);

  const handleChange = (key: keyof LocalCareer, value: string) => {
    setCareer((prev) => ({ ...prev, [key]: value }));
  };

  const handleBlur = () => {
    onBlur(career);
  };

  return (
    <div className="relative rounded border border-gray-300 p-5">
      <button
        type="button"
        onClick={() => onDelete(career)}
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        aria-label={`경력 ${String(index + 1).padStart(2, '0')} 삭제`}
      >
        X
      </button>

      <h3 className="mb-4 text-sm font-semibold">
        경력 {String(index + 1).padStart(2, '0')}
      </h3>

      {/* Row 1: Company + Field */}
      <div className="mb-3 flex gap-6">
        <div className="flex flex-1 items-center gap-2">
          <label className="w-16 flex-shrink-0 text-sm text-gray-700">
            회사명
          </label>
          <input
            type="text"
            value={career.company}
            onChange={(e) => handleChange('company', e.target.value)}
            onBlur={handleBlur}
            className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-gray-500"
          />
        </div>
        <div className="flex flex-1 items-center gap-2">
          <label className="w-16 flex-shrink-0 text-sm text-gray-700">
            업무분야
          </label>
          <input
            type="text"
            value={career.field}
            onChange={(e) => handleChange('field', e.target.value)}
            onBlur={handleBlur}
            className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-gray-500"
          />
        </div>
      </div>

      {/* Row 2: Position + Department */}
      <div className="mb-3 flex gap-6">
        <div className="flex flex-1 items-center gap-2">
          <label className="w-16 flex-shrink-0 text-sm text-gray-700">
            직책
          </label>
          <input
            type="text"
            value={career.position}
            onChange={(e) => handleChange('position', e.target.value)}
            onBlur={handleBlur}
            className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-gray-500"
          />
        </div>
        <div className="flex flex-1 items-center gap-2">
          <label className="w-16 flex-shrink-0 text-sm text-gray-700">
            부서명
          </label>
          <input
            type="text"
            value={career.department}
            onChange={(e) => handleChange('department', e.target.value)}
            onBlur={handleBlur}
            className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-gray-500"
          />
        </div>
      </div>

      {/* Row 3: Period */}
      <div className="flex items-center gap-2">
        <label className="w-16 flex-shrink-0 text-sm text-gray-700">
          재직 기간
        </label>
        <input
          type="month"
          value={career.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          onBlur={handleBlur}
          className="w-36 rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-gray-500"
        />
        <span className="text-sm text-gray-500">~</span>
        <input
          type="month"
          value={career.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          onBlur={handleBlur}
          className="w-36 rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-gray-500"
        />
      </div>
    </div>
  );
}

