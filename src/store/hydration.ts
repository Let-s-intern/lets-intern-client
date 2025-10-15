export interface HydrationStore {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}
