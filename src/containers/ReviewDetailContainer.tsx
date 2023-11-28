import { useState } from 'react';

import ReviewDetail from '../components/Review/ReviewDetail';

const ReviewDetailContainer = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  return <ReviewDetail loading={loading} error={error} />;
};

export default ReviewDetailContainer;
