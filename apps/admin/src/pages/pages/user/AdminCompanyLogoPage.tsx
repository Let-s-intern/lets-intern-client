import { Tab, Tabs } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import CompanyLogoManager from '@/domain/company-logo/CompanyLogoManager';
import Heading from '@/domain/admin/ui/heading/Heading';

export default function AdminCompanyLogoPage() {
  const navigate = useNavigate();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      navigate('/mentors');
    } else if (newValue === 1) {
      navigate('/mentors/register');
    } else if (newValue === 2) {
      navigate('/mentors/keywords');
    }
  };

  return (
    <section className="p-5">
      <Heading className="mb-4">멘토 관리</Heading>

      <Tabs value={3} onChange={handleTabChange} className="mb-4">
        <Tab label="멘토 관리" />
        <Tab label="멘토 등록" />
        <Tab label="멘토 키워드" />
        <Tab label="회사 로고" />
      </Tabs>

      <CompanyLogoManager />
    </section>
  );
}
