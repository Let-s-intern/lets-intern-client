'use client';

import { useLeadHistoryListQuery } from '@/api/lead';
import { useGetMagnetListQuery } from '@/api/magnet/magnet';
import { useMemo } from 'react';
import type {
  LeadHistoryGroupSummary,
  LeadHistoryRow,
  SelectOption,
} from '../types';

const useLeadHistoryData = () => {
  const { data: leadHistoryData = [], isLoading } = useLeadHistoryListQuery();
  const { data: magnetListData } = useGetMagnetListQuery();

  const allRows = useMemo<LeadHistoryRow[]>(() => {
    if (!leadHistoryData.length) return [];
    return leadHistoryData.map((item, index) => {
      const trimmedPhone = item.phoneNum?.trim() ?? null;
      const displayPhoneNum =
        trimmedPhone ??
        (item.userId !== null && item.userId !== undefined
          ? `회원 #${item.userId}`
          : '미등록');
      const rowId = [
        trimmedPhone ?? 'NO_PHONE',
        item.magnetId ?? 'NO_MAGNET',
        item.createDate ?? 'NO_DATE',
        index,
      ].join('_');

      return {
        id: rowId,
        phoneNum: trimmedPhone,
        displayPhoneNum,
        name: item.name ?? null,
        email: item.email ?? null,
        inflow: item.inflow ?? null,
        university: item.university ?? null,
        major: item.major ?? null,
        wishField: item.wishField ?? null,
        wishCompany: item.wishCompany ?? null,
        wishIndustry: item.wishIndustry ?? null,
        wishJob: item.wishJob ?? null,
        jobStatus: item.jobStatus ?? null,
        instagramId: item.instagramId ?? null,
        marketingAgree: item.marketingAgree ?? null,
        eventType: item.eventType,
        magnetId: item.magnetId ?? null,
        magnetType: item.magnetType ?? null,
        userId: item.userId ?? null,
        title: item.title ?? null,
        finalPrice: item.finalPrice ?? null,
        createDate: item.createDate ?? null,
      };
    });
  }, [leadHistoryData]);

  const magnetOptions = useMemo<SelectOption[]>(
    () =>
      (magnetListData?.magnetList ?? [])
        .map((m) => ({ value: String(m.magnetId), label: m.title }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [magnetListData],
  );

  const magnetLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    magnetOptions.forEach(({ value, label }) => map.set(value, label));
    return map;
  }, [magnetOptions]);

  const programOptions = useMemo<SelectOption[]>(() => {
    const unique = new Set<string>();
    allRows.forEach((row) => {
      if (row.eventType === 'PROGRAM' && row.title) unique.add(row.title);
    });
    return Array.from(unique)
      .sort((a, b) => a.localeCompare(b))
      .map((title) => ({ value: title, label: title }));
  }, [allRows]);

  const magnetTypeOptions = useMemo<SelectOption[]>(() => {
    const unique = new Set<string>();
    allRows.forEach((row) => {
      if (row.magnetType) unique.add(row.magnetType);
    });
    return Array.from(unique)
      .sort((a, b) => a.localeCompare(b))
      .map((type) => ({ value: type, label: type }));
  }, [allRows]);

  const magnetTypeLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    magnetTypeOptions.forEach(({ value, label }) => map.set(value, label));
    return map;
  }, [magnetTypeOptions]);

  const groupSummaryMap = useMemo(() => {
    const map = new Map<string, LeadHistoryGroupSummary>();
    allRows.forEach((row) => {
      const key = row.displayPhoneNum;
      const summary = map.get(key) ?? {
        magnetIds: new Set<string>(),
        magnetTypes: new Set<string>(),
        programTitles: new Set<string>(),
        hasSignedUp: false,
        hasMarketingAgreement: false,
      };
      if (row.magnetId !== null && row.magnetId !== undefined)
        summary.magnetIds.add(String(row.magnetId));
      if (row.magnetType) summary.magnetTypes.add(row.magnetType);
      if (row.eventType === 'PROGRAM' && row.title)
        summary.programTitles.add(row.title);
      if (row.userId !== null && row.userId !== undefined)
        summary.hasSignedUp = true;
      if (row.marketingAgree === true) summary.hasMarketingAgreement = true;
      map.set(key, summary);
    });
    return map;
  }, [allRows]);

  return {
    allRows,
    isLoading,
    magnetOptions,
    magnetLabelMap,
    programOptions,
    magnetTypeOptions,
    magnetTypeLabelMap,
    groupSummaryMap,
  };
};

export default useLeadHistoryData;
