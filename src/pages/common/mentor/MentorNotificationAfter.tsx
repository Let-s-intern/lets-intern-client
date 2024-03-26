import { useState } from 'react';

import PasswordContent from '../../../components/common/mentor/PasswordContent';
import MentorAfterContent from '../../../components/common/mentor/MentorAfterContent';

const MentorNotificationAfter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contentData, setContentData] = useState();

  const isLoading = !contentData;

  return !isAuthenticated ? (
    <PasswordContent
      mode="AFTER"
      setIsAuthenticated={setIsAuthenticated}
      setContentData={setContentData}
    />
  ) : (
    <MentorAfterContent contentData={contentData} isLoading={isLoading} />
  );
};

export default MentorNotificationAfter;
