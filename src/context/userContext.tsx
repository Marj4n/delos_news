import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import {
  getSession as getSessionFromStorage,
  removeSession,
  setSession as setSessionInStorage,
} from "@/lib/utils";
import { AccountType } from "@/types/account";

interface UserContextType {
  user: AccountType | null;
  setUser: (user: AccountType | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AccountType | null>(null);

  useEffect(() => {
    const session = getSessionFromStorage() as AccountType | null;
    setUser(session);
  }, []);

  const updateUser = (newUser: AccountType | null) => {
    setUser(newUser);
    if (newUser === null) {
      removeSession();
    } else setSessionInStorage(newUser!!);
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
