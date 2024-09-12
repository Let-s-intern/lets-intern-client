import { useEffect, useState } from 'react';

export default function useValidateUrl(url: string) {
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (url === '') return;
    try {
      new URL(url);
      setIsValid(true);
    } catch (error) {
      setIsValid(false);
    }
  }, [url]);

  return isValid;
}
