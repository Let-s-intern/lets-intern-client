import CompanyLogoManager from '@/domain/company-logo/CompanyLogoManager';
import Heading from '@/domain/admin/ui/heading/Heading';

export default function AdminCompanyLogoPage() {
  return (
    <section className="p-5">
      <Heading className="mb-4">멘토 관리</Heading>

      <CompanyLogoManager />
    </section>
  );
}
