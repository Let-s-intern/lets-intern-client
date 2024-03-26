import { useState } from 'react';

import PasswordContent from '../../../components/common/mentor/PasswordContent';
import MentorBeforeContent from '../../../components/common/mentor/MentorBeforeContent';

const MentorNotificationBefore = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contentData, setContentData] = useState<any>();

  const isLoading = !contentData;

  return !isAuthenticated ? (
    <PasswordContent
      mode="BEFORE"
      setIsAuthenticated={setIsAuthenticated}
      setContentData={setContentData}
    />
  ) : (
    <MentorBeforeContent contentData={contentData} isLoading={isLoading} />
  );
};

export default MentorNotificationBefore;
