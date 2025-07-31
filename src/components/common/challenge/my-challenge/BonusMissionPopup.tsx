import { useState } from 'react';

interface BonusMissionPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onPopupClick: () => void;
}

const BonusMissionPopup = ({
  isVisible,
  onClose,
  onPopupClick,
}: BonusMissionPopupProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = (e?: React.MouseEvent) => {
    // 이벤트 버블링 방지
    if (e) {
      e.stopPropagation();
    }
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  const handlePopupClick = () => {
    onPopupClick();
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`absolute inset-0 top-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative rounded-lg bg-white shadow-xl transition-transform duration-200 ${
          isClosing ? 'scale-95' : 'scale-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 팝업 이미지 컨테이너 */}
        <div className="relative cursor-pointer" onClick={handlePopupClick}>
          {/* 팝업 이미지 */}
          <div className="flex h-96 w-80 items-center justify-center rounded-lg border-2 border-yellow-300 bg-gradient-to-br from-yellow-100 to-yellow-200">
            <div className="text-center">
              <div className="mb-4 text-2xl font-bold text-yellow-800">
                🎁 보너스 미션 안내 이미지
              </div>
            </div>
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={(e) => handleClose(e)}
            className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-colors duration-200 hover:bg-green-600"
          >
            <span className="text-lg font-bold">×</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BonusMissionPopup;
