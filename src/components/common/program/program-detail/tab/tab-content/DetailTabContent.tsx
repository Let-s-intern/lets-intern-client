import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import axios from '../../../../../../utils/axios';

interface DetailTabContentProps {
  programType: string;
  programId: number;
}

const DetailTabContent = ({
  programType,
  programId,
}: DetailTabContentProps) => {
  const [content, setContent] = useState<string>('');

  useQuery({
    queryKey: ['detail'],
    queryFn: async () => {
      const res = await axios.get(`/${programType}/${programId}/content`);
      setContent(res.data.data.content.description);
      return res.data;
    },
  });

  return (
    <div className="py-2">
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default DetailTabContent;
