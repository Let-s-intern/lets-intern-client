import { Button } from '@mui/material';
import { useCallback, useState } from 'react';
import { FaSave } from 'react-icons/fa';

import { CreateLiveReq } from '@/schema';
import Header from '@components/admin/ui/header/Header';
import Heading from '@components/admin/ui/heading/Heading';
import { Heading2 } from '@components/admin/ui/heading/Heading2';
import dayjs from 'dayjs';

const LiveCreate: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState<Omit<CreateLiveReq, 'desc'>>({
    title: '',
    shortDesc: '',
    criticalNotice: '',
    participationCount: 0,
    thumbnail: '',
    mentorName: '',
    job: '',
    place: '',
    startDate: dayjs().format('YYYY-MM-DDTHH:mm'),
    endDate: dayjs().format('YYYY-MM-DDTHH:mm'),
    beginning: dayjs().format('YYYY-MM-DDTHH:mm'),
    deadline: dayjs().format('YYYY-MM-DDTHH:mm'),
    progressType: 'ALL',
    programTypeInfo: [],
    priceInfo: {
      priceInfo: {
        price: 0,
        discount: 0,
        accountNumber: '',
        deadline: dayjs().format('YYYY-MM-DDTHH:mm'),
        accountType: 'KB',
      },
      livePriceType: 'CHARGE',
    },
    faqInfo: [],
  });

  const onClickSave = useCallback(async () => {
    setLoading(true);
    // 라이브 생성
    setLoading(false);
  }, []);

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>라이브 생성</Heading>
      </Header>

      <Heading2>기본 정보</Heading2>
      <section className="mb-6 mt-3">
        <div className="mb-6 grid w-full grid-cols-2 gap-3">
          {/* 기본 정보 */}
          {/* 썸네일 */}
        </div>
        <div className="grid w-full grid-cols-2 gap-3">
          {/* 가격 정보 */}

          {/* 일정 */}
        </div>
      </section>

      <footer className="flex items-center justify-end gap-3">
        <Button
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={<FaSave size={12} />}
          onClick={onClickSave}
        >
          저장
        </Button>
      </footer>
    </div>
  );
};

export default LiveCreate;
