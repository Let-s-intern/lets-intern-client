import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import axios from '../../../../../utils/axios';
import FAQToggle from '../../faq/FAQToggle';

export interface FAQType {
  id: number;
  question: string;
  answer: string;
  faqProgramType: string;
}

interface FAQTabContentProps {
  programId: number;
  programType: string;
}

const FAQTabContent = ({ programType, programId }: FAQTabContentProps) => {
  const [faqList, setFaqList] = useState<FAQType[]>([]);

  useQuery({
    queryKey: [programType, programId, 'faqs'],
    queryFn: async () => {
      const res = await axios.get(`/${programType}/${programId}/faqs`);
      setFaqList(res.data.data.faqList);
      return res.data;
    },
  });

  return (
    <div>
      <ul>
        {faqList.map((faq) => (
          <FAQToggle key={faq.id} faq={faq} />
        ))}
      </ul>
    </div>
  );
};

export default FAQTabContent;
