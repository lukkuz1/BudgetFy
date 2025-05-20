import React, { createContext, useContext, useState, useEffect } from "react";
import { rtdb } from "../services/firebase";
import { child, ref, get, update } from "firebase/database";

type Props = {
  children?: React.ReactNode;
};

type UserData = {
  email: string;
  uid: string;
};

type UserContextData = {
  initialized: boolean;
  user: UserData | null;
  initialize(user: UserData): Promise<void>;
  destroy(): void;
  updateDataJSON(updateData: Record<string, unknown>): Promise<void>;
};

const userContext = createContext<UserContextData>({} as UserContextData);

export const useUser = () => useContext(userContext);

export const UserProvider: React.FC<Props> = ({ children }: Props) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    console.log(
      initialized
        ? "useUser: User initialized (status = true)"
        : "useUser: User is not initialized (status = false)"
    );
  }, [initialized]);

  useEffect(() => {
    if (!user) {
      setInitialized(false);
    }
  }, [user]);

  const initialize = async (userData: UserData): Promise<void> => {
    try {
      setUser(userData);

      const dbRef = ref(rtdb);
      const snapshot = await get(child(dbRef, `users/${userData.uid}`));

      if (!snapshot.exists()) {
        const newUserData = { email: userData.email };
        await update(ref(rtdb, `users/${userData.uid}`), newUserData);
      }

      setInitialized(true);
    } catch (error) {
      console.error("Error initializing user:", error);
    }
  };

  const destroy = () => {
    setUser(null);
  };

  const updateDataJSON = async (
    updateData: Record<string, unknown>
  ): Promise<void> => {
    if (initialized && user) {
      try {
        await update(ref(rtdb, `users/${user.uid}`), updateData);
        console.log("User data updated:", updateData);
      } catch (error) {
        console.error("Failed to update user data:", error);
      }
    } else {
      console.error("Cannot update data: user is not initialized or logged in");
    }
  };

  return (
    <userContext.Provider
      value={{
        initialized,
        user,
        initialize,
        destroy,
        updateDataJSON,
      }}
    >
      {children}
    </userContext.Provider>
  );
};
