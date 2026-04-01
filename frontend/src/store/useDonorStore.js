import { create } from 'zustand';

const useDonorStore = create((set) => ({
  globalSearchResults: [],
  setGlobalSearchResults: (results) => set({ globalSearchResults: results }),
  isFetchingDonors: false,
  setIsFetchingDonors: (isFetching) => set({ isFetchingDonors: isFetching }),
}));

export default useDonorStore;
