'use client';

import Heading2 from '@/domain/admin/ui/heading/Heading2';
import type React from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <section className="flex flex-col gap-3">
      <Heading2>{title}</Heading2>
      {children}
    </section>
  );
};

export default FormSection;
