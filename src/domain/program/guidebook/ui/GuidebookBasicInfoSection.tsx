'use client';

import type { GuidebookData } from '@/schema';
import CardIcon from '@/assets/icons/credit-card.svg?react';
import FileIcon from '@/assets/icons/file.svg?react';
import FolderIcon from '@/assets/icons/folder.svg?react';
import UserIcon from '@/assets/icons/mentor.svg?react';
import BackHeader from '@/common/header/BackHeader';
import BasicInfoRow from '../../program-detail/basicInfo/BasicInfoRow';

interface GuidebookBasicInfoSectionProps {
  guidebook: GuidebookData;
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
  const thumbnail =
    guidebook.thumbnailDesktop ?? guidebook.thumbnailMobile ?? null;
  const priceInfo = guidebook.priceInfo;
  const price = priceInfo?.price ?? 0;
  const discount = priceInfo?.discount ?? 0;

  return (
    <div className="mx-auto w-full max-w-[1000px] px-5 pb-10 md:px-0 md:pb-20">
      <div>
        <BackHeader to="/program">{guidebook.title ?? ''}</BackHeader>
      </div>
      <div className="flex flex-col items-stretch gap-3 md:flex-row md:gap-6">
        {/* 썸네일 */}
        <div className="w-full rounded-md bg-neutral-95 object-contain md:w-3/5">
          <img src={thumbnail ?? undefined} alt="가이드북 썸네일" />
        </div>

        {/* 가이드북 정보 */}
        <div className="flex w-full flex-col gap-3 rounded-md md:max-w-[424px]">
          <div className="flex w-full items-center justify-center rounded-md bg-neutral-95 px-4 py-5">
            <div className="flex w-full flex-col gap-y-5 text-primary-90">
              <BasicInfoRow
                icon={<FolderIcon />}
                title="자료 구성"
                content={guidebook.contentStructure}
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
          <div className="flex w-full items-center justify-center rounded-md bg-neutral-95 px-4 py-5">
            <div className="flex w-full flex-col gap-y-5 text-primary-90">
              <BasicInfoRow
                icon={<CardIcon />}
                title="가격"
                content={
                  <>
                    <div className="flex w-full flex-col gap-y-2.5 border-b border-neutral-80 pb-4 pt-2.5 text-neutral-0">
                      <div className="flex w-full items-center justify-between gap-x-4">
                        <span className="text-xsmall16">정가</span>
                        <span>{price.toLocaleString()}원</span>
                      </div>
                      <div className="flex w-full items-center justify-between gap-x-4">
                        <span className="text-xsmall16 font-bold text-primary">
                          {getDiscountPercent(price, discount)}% 할인
                        </span>
                        <span>-{discount.toLocaleString()}원</span>
                      </div>
                    </div>
                    <div className="w-full pt-3 text-end text-xxlarge32 font-bold text-neutral-0">
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
