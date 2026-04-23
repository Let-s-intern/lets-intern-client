import { useRef, useState } from 'react';

export default function useInstagramAlert() {
  const isInstagram = useRef(
    typeof window !== 'undefined'
      ? window.navigator.userAgent.includes('Instagram')
      : false,
  );

  const [showInstagramAlert, setShowInstagramAlert] = useState(false);

  return {
    isInstagram: isInstagram.current,
    showInstagramAlert,
    setShowInstagramAlert,
  };
}
