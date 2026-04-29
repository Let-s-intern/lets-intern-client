import CardIcon from '@/assets/icons/credit-card.svg?react';
import FileIcon from '@/assets/icons/file.svg?react';
import FolderIcon from '@/assets/icons/folder.svg?react';
import UserIcon from '@/assets/icons/mentor.svg?react';
import BackHeader from '@/common/header/BackHeader';
import type { GuidebookPublicViewModel } from '../utils/publicGuidebookMapping';
import BasicInfoRow from '../../program-detail/basicInfo/BasicInfoRow';

interface GuidebookBasicInfoSectionProps {
  guidebook: GuidebookPublicViewModel;
}

export const getDiscountPercent = (
  originalPrice: number,
  discountPrice: number,
): number => {
  if (originalPrice === 0) return 0;
  return Math.round((discountPrice / originalPrice) * 100);
};

const GuidebookBasicInfoSection = ({
  guidebook,
}: GuidebookBasicInfoSectionProps) => {
  const thumbnail = guidebook.thumbnail ?? guidebook.desktopThumbnail ?? null;
  const price = guidebook.price ?? 0;
  const discount = guidebook.discount ?? 0;

  return (
    <div className="mx-auto w-full max-w-[1000px] px-5 pb-10 md:px-10 md:pb-20 md:pt-[60px] lg:px-0">
      <div>
        <BackHeader className="md:hidden" to="/program">
          {guidebook.title ?? ''}
        </BackHeader>
      </div>
      <div className="flex flex-col items-stretch gap-6 md:flex-row">
        {/* 썸네일 */}
        <div className="bg-neutral-95 flex w-full items-center justify-center overflow-hidden rounded-md md:w-3/5">
          <img src={thumbnail ?? undefined} alt="가이드북 썸네일" />
        </div>

        {/* 가이드북 정보 */}
        <div className="flex w-full flex-col gap-3 rounded-md md:max-w-[424px]">
          <div className="bg-neutral-95 flex w-full items-center justify-center rounded-md px-4 py-5">
            <div className="text-primary-90 flex w-full flex-col gap-y-5">
              <BasicInfoRow
                icon={<FolderIcon />}
                title="자료 구성"
                content={guidebook.contentComposition}
              />
              <BasicInfoRow
                icon={<FileIcon />}
                title="열람 방식"
                content={guidebook.accessMethod}
              />
              <BasicInfoRow
                icon={<UserIcon />}
                title="추천 대상"
                content={guidebook.recommendedFor}
              />
            </div>
          </div>
          <div className="bg-neutral-95 flex w-full items-center justify-center rounded-md px-4 py-5">
            <div className="text-primary-90 flex w-full flex-col gap-y-5">
              <BasicInfoRow
                icon={<CardIcon />}
                title="가격"
                content={
                  <>
                    <div className="border-neutral-80 text-neutral-0 flex w-full flex-col gap-y-2.5 border-b pb-4 pt-2.5">
                      <div className="flex w-full items-center justify-between gap-x-4">
                        <span className="text-xsmall16">정가</span>
                        <span>{price.toLocaleString()}원</span>
                      </div>
                      <div className="flex w-full items-center justify-between gap-x-4">
                        <span className="text-xsmall16 text-primary font-bold">
                          {getDiscountPercent(price, discount)}% 할인
                        </span>
                        <span>-{discount.toLocaleString()}원</span>
                      </div>
                    </div>
                    <div className="text-xxlarge32 text-neutral-0 w-full pt-3 text-end font-bold">
                      {(price - discount).toLocaleString()}원
                    </div>
                  </>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidebookBasicInfoSection;
