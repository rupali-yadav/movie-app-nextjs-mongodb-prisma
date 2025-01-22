import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { iProfile } from '../types';



type ProfileContextType = {
  selectedProfile: iProfile | null;
  setSelectedProfile: (profile: iProfile) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProfile, setSelectedProfile] = useState<iProfile | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProfile = window.localStorage.getItem("profile");
      if (storedProfile) {
        setSelectedProfile(JSON.parse(storedProfile));
      }
    }
  }, []);

  return (
    <ProfileContext.Provider value={{ selectedProfile, setSelectedProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);

  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
