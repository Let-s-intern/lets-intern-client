import dayjs from '@/lib/dayjs';
import { forwardRef } from 'react';

interface CertificatePaperProps {
  programName: string;
  description: string;
  startDate: string;
  endDate: string;
  userName: string;
}

const CertificatePaper = forwardRef<HTMLDivElement, CertificatePaperProps>(
  ({ programName, description, startDate, endDate, userName }, ref) => {
    return (
      <div
        ref={ref}
        className="flex flex-col items-center bg-certificate-bg bg-contain bg-no-repeat bg-origin-padding tracking-[-0.64px]"
        style={{
          fontFamily: 'Bookk Myungjo Variable',
          width: '210mm',
          height: '297mm',
          overflow: 'hidden',
          paddingTop: '96mm',
          paddingLeft: '34mm',
          paddingRight: '34mm',
          paddingBottom: '61mm',
        }}
      >
        <h1 className="text-center text-[24px] font-bold">{programName}</h1>
        <div className="pt-[11mm]">
          <p className="text-center">{description}</p>
          <p className="pt-[3mm] text-center text-[12px]">
            {startDate} ~ {endDate}
          </p>
        </div>
        <hr className="mb-[18mm] mt-[11mm] w-full border-[#16083D]" />
        <h2 className="text-center text-[40px] font-bold tracking-[24px]">
          {userName}
        </h2>
        <p className="whitespace-pre break-keep px-[6mm] pb-[11mm] pt-[18mm] text-center text-[16px] font-bold leading-[24px]">{`위 참여자는 렛츠커리어가 운영하는\n${programName} 과정을 수료하였기에${programName.length > 10 ? '\n' : ' '}이 증서를 수여합니다.`}</p>
        <p className="font-normal">{dayjs().format('YYYY년 MM월 DD일')}</p>
      </div>
    );
  },
);

// Display name 설정
CertificatePaper.displayName = 'CertificatePaper';

export default CertificatePaper;
