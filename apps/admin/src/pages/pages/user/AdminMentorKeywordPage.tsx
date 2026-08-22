import { useNavigate } from 'react-router-dom';
import Heading from '@/domain/admin/ui/heading/Heading';
import MentorHashTagManagement from '@/domain/mentor/hash-tag/MentorHashTagManagement';
import { Tab, Tabs } from '@mui/material';

export default function AdminMentorKeywordPage() {
  const navigate = useNavigate();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      navigate('/mentors');
    } else if (newValue === 1) {
      navigate('/mentors/register');
    }
  };

  return (
    <section className="p-5">
      <Heading className="mb-4">멘토 관리</Heading>

      <Tabs value={2} onChange={handleTabChange} className="mb-4">
        <Tab label="멘토 관리" />
        <Tab label="멘토 등록" />
        <Tab label="멘토 키워드" />
      </Tabs>

      <MentorHashTagManagement />
    </section>
  );
}
