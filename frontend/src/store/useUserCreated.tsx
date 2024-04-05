import { create } from 'zustand';

interface UserCreatedStore {
  isUserCreated: boolean;
  setUserCreated: (formSubmitted: boolean) => void;
}

const useUserCreated = create<UserCreatedStore>((set) => ({
  // Initial selected section
  isUserCreated: false,

  // Set selected section action
  setUserCreated: (formSubmitted) =>
    set((state) => ({
      ...state,
      isUserCreated: formSubmitted,
    })),
}));

export default useUserCreated;
