import { usePostAdminCareerMutation } from '@/api/career/career';
import { UserCareerType } from '@/api/career/careerSchema';
import CareerForm from '@/domain/mypage/career/CareerForm';
import { DEFAULT_CAREER } from '@/domain/mypage/career/constants';
import { UserAdminDetail } from '@/schema';
import { getFileNameFromUrl } from '@/utils/getFileNameFromUrl';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const getDocumentLabel = (type: string) => {
  switch (type) {
    case 'RESUME':
      return '이력서';
    case 'COVER_LETTER':
      return '자기소개서';
    case 'PORTFOLIO':
      return '포트폴리오';
    default:
      return '서류';
  }
};

const PersonalHistory = ({ data }: { data: UserAdminDetail }) => {
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const createCareerMutation = usePostAdminCareerMutation(+data.userInfo.id);

  const handleSubmit = async (career: UserCareerType) => {
    const formData = new FormData();

    const requestDto = new Blob([JSON.stringify(career)], {
      type: 'application/json',
    });

    formData.append('requestDto', requestDto);

    try {
      await createCareerMutation.mutateAsync(formData);
      setIsWriteOpen(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <section>
        <div className="flex items-center justify-between border-b pb-2">
          <h1 className="pb-1 text-lg font-semibold">경력</h1>
          <button onClick={() => setIsWriteOpen(true)}>
            <Plus size={20} />
          </button>
        </div>
        <div className="mt-4">
          {data.careerInfos?.length === 0 && !isWriteOpen ? (
            <div className="text-center text-neutral-500">
              등록된 경력이 없습니다.
            </div>
          ) : (
            <div className="mb-4 flex flex-col gap-4">
              {data.careerInfos?.map((career, index) => (
                <div
                  key={index}
                  className="flex w-full flex-col gap-1 rounded-xs border border-neutral-80 p-4"
                >
                  <div className="text-sm text-neutral-0">{career.job}</div>
                  <span className="text-neutral-0">{career.company}</span>
                  <div className="flex items-center gap-2 text-sm text-neutral-0">
                    <span>{career.employmentType}</span>
                    <span className="text-neutral-40">
                      {career.startDate} - {career.endDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* 경력 추가 모달 */}
          {isWriteOpen && (
            <CareerForm
              initialCareer={DEFAULT_CAREER}
              handleCancel={() => setIsWriteOpen(false)}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between border-b pb-2">
          <h1 className="text-lg font-semibold">서류</h1>
        </div>
        <div>
          {data.userDocumentInfo?.length === 0 ? (
            <div className="mt-4 text-center text-neutral-500">
              등록된 서류가 없습니다.
            </div>
          ) : (
            <ul className="mt-2 flex flex-col gap-y-2">
              {data.userDocumentInfo?.map((doc) => {
                return (
                  <li key={doc.userDocumentId} className="rounded-sm py-2">
                    <a
                      href={doc?.fileUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:opacity-80"
                    >
                      <span className="rounded bg-neutral-200 px-2 py-1 text-xs font-medium">
                        {getDocumentLabel(doc.userDocumentType)}
                      </span>
                      <span className="text-blue-700 underline">
                        {doc.fileUrl
                          ? getFileNameFromUrl(
                              doc.userDocumentType,
                              doc.fileUrl,
                            )
                          : '-'}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default PersonalHistory;
