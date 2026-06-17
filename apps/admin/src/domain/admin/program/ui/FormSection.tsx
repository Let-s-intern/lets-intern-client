import Heading2 from '@/domain/admin/ui/heading/Heading2';
import type React from 'react';

interface FormSectionProps {
  title: string;
  required?: boolean;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  required,
  children,
}) => {
  return (
    <section className="flex flex-col gap-3">
      <Heading2>
        {title}
        {required && (
          <>
            <span className="ml-1 text-red-500">* </span>{' '}
          </>
        )}
      </Heading2>
      {children}
    </section>
  );
};

export default FormSection;
