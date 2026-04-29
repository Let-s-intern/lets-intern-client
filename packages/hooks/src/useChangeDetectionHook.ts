import { useState } from 'react';

interface CareerPlanValues {
  university: string | null;
  grade: string | null;
  major: string | null;
  wishField: string | null;
  wishJob: string | null;
  wishCompany: string | null;
  wishIndustry: string | null;
  wishEmploymentType: string | null;
}

interface UseChangeDetectionProps {
  user: CareerPlanValues;
  selectedField: string | null;
  selectedPositions: string[];
  selectedIndustries: string[];
}

export const useChangeDetection = ({
  user,
  selectedField,
  selectedPositions,
  selectedIndustries,
}: UseChangeDetectionProps) => {
  const [initialUser, setInitialUser] = useState<CareerPlanValues | null>(null);
  const [initialField, setInitialField] = useState<string | null>(null);
  const [initialPositions, setInitialPositions] = useState<string[]>([]);
  const [initialIndustries, setInitialIndustries] = useState<string[]>([]);

  const setInitialValues = (
    newUser: CareerPlanValues,
    newField: string | null,
    newPositions: string[],
    newIndustries: string[],
  ) => {
    setInitialUser(newUser);
    setInitialField(newField);
    setInitialPositions(newPositions);
    setInitialIndustries(newIndustries);
  };

  const hasChanges =
    initialUser &&
    (JSON.stringify(user) !== JSON.stringify(initialUser) ||
      JSON.stringify(selectedField) !== JSON.stringify(initialField) ||
      JSON.stringify(selectedPositions) !== JSON.stringify(initialPositions) ||
      JSON.stringify(selectedIndustries) !== JSON.stringify(initialIndustries));

  return {
    initialUser,
    initialField,
    initialPositions,
    initialIndustries,
    setInitialValues,
    hasChanges,
  };
};
