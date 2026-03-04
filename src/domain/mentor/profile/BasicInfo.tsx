'use client';

export interface BasicInfoFormData {
  name: string;
  nickname: string;
  phoneNum: string;
  sns: string;
  email: string;
}

interface BasicInfoProps {
  formData: BasicInfoFormData;
  onChange: (data: BasicInfoFormData) => void;
}

const FIELDS: { key: keyof BasicInfoFormData; label: string }[] = [
  { key: 'name', label: '이름' },
  { key: 'nickname', label: '활동명' },
  { key: 'phoneNum', label: '전화번호' },
  { key: 'sns', label: 'SNS' },
  { key: 'email', label: 'e-mail' },
];

export default function BasicInfo({ formData, onChange }: BasicInfoProps) {
  const handleChange = (key: keyof BasicInfoFormData, value: string) => {
    onChange({ ...formData, [key]: value });
  };

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">기본 정보</h2>
      <div className="flex gap-8">
        {/* Profile Image Placeholder */}
        <div className="relative flex h-60 w-60 flex-shrink-0 items-center justify-center overflow-hidden rounded border border-gray-300 bg-gray-200">
          {/* User icon placeholder */}
          {/* Diagonal X lines */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 240 240"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="0"
              x2="240"
              y2="240"
              stroke="#9ca3af"
              strokeWidth="1"
            />
            <line
              x1="240"
              y1="0"
              x2="0"
              y2="240"
              stroke="#9ca3af"
              strokeWidth="1"
            />
          </svg>
          <span className="absolute text-sm text-gray-500">
            프로필 이미지
          </span>
        </div>

        {/* Input Fields */}
        <div className="flex flex-1 flex-col justify-center gap-4">
          {FIELDS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <label className="w-20 flex-shrink-0 text-right text-sm font-medium text-gray-700">
                {label}:
              </label>
              <input
                type="text"
                value={formData[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-gray-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
