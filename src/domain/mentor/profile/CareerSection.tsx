'use client';

export interface Career {
  company: string;
  field: string;
  position: string;
  department: string;
  startDate: string;
  endDate: string;
}

interface CareerSectionProps {
  careers: Career[];
  onChange: (careers: Career[]) => void;
}

const EMPTY_CAREER: Career = {
  company: '',
  field: '',
  position: '',
  department: '',
  startDate: '',
  endDate: '',
};

export default function CareerSection({
  careers,
  onChange,
}: CareerSectionProps) {
  const handleAdd = () => {
    onChange([...careers, { ...EMPTY_CAREER }]);
  };

  const handleDelete = (index: number) => {
    onChange(careers.filter((_, i) => i !== index));
  };

  const handleFieldChange = (
    index: number,
    key: keyof Career,
    value: string,
  ) => {
    const updated = careers.map((career, i) =>
      i === index ? { ...career, [key]: value } : career,
    );
    onChange(updated);
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">경력</h2>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
        >
          경력 추가하기 +
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {careers.map((career, index) => (
          <div
            key={index}
            className="relative rounded border border-gray-300 p-5"
          >
            {/* Delete button */}
            <button
              type="button"
              onClick={() => handleDelete(index)}
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
                  onChange={(e) =>
                    handleFieldChange(index, 'company', e.target.value)
                  }
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
                  onChange={(e) =>
                    handleFieldChange(index, 'field', e.target.value)
                  }
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
                  onChange={(e) =>
                    handleFieldChange(index, 'position', e.target.value)
                  }
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
                  onChange={(e) =>
                    handleFieldChange(index, 'department', e.target.value)
                  }
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
                type="text"
                value={career.startDate}
                onChange={(e) =>
                  handleFieldChange(index, 'startDate', e.target.value)
                }
                placeholder="YYYY.MM."
                className="w-32 rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-gray-500"
              />
              <span className="text-sm text-gray-500">~</span>
              <input
                type="text"
                value={career.endDate}
                onChange={(e) =>
                  handleFieldChange(index, 'endDate', e.target.value)
                }
                placeholder="YYYY.MM."
                className="w-32 rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-gray-500"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
