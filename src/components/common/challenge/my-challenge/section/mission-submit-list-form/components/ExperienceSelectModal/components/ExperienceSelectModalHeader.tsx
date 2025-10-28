interface ExperienceSelectModalHeaderProps {
  onClose: () => void;
}

export const ExperienceSelectModalHeader = ({
  onClose,
}: ExperienceSelectModalHeaderProps) => {
  return (
    <div className="px-6 py-4">
      {/* 제목과 닫기 버튼 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-900">
            경험 정리 목록
          </h2>
          <span className="font-regular inline-flex items-center rounded-xxs bg-gray-100 px-2 py-1 text-xxsmall12 text-gray-600">
            최소 3개 이상 선택
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* 안내사항 */}
      <div className="mt-1.5 space-y-1 text-xsmall14 text-neutral-10">
        <p>• 모든 항목을 작성 완료한 경험만 제출할 수 있습니다.</p>
        <p>
          • 수정은,{' '}
          <a
            href="/career/experience"
            className="text-blue-600 underline hover:text-blue-800"
          >
            [커리어 관리 &gt; 경험 정리]
          </a>
          에서 진행해주세요.
        </p>
      </div>
    </div>
  );
};
