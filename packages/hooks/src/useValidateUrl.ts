import { useEffect, useState } from 'react';

export default function useValidateUrl(url?: string | null) {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!url || url === '') return;

    try {
      new URL(url);
      setIsValid(true);
    } catch (error) {
      setIsValid(false);
    }
  }, [url]);

  return isValid;
}
