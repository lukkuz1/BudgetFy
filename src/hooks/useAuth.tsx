import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential,
  updatePassword as firebaseUpdatePassword,
  updateEmail as firebaseUpdateEmail,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { useUser } from "./useUser";

type Props = {
  children?: React.ReactNode;
};

type UserData = {
  email: string;
  uid: string;
};

type AuthContextData = {
  loggedIn: boolean;
  user: UserData | null;
  signUp(email: string, password: string): Promise<UserCredential | string>;
  signIn(email: string, password: string): Promise<UserCredential | string>;
  signOut(): Promise<void>;
  updatePassword(newPassword: string): Promise<void | string>;
  updateEmail(newEmail: string): Promise<void | string>;
};

const authContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => useContext(authContext);

export const AuthProvider: React.FC<Props> = ({ children }: Props) => {
  const [user, setUser] = useState<UserData | null>(null);
  const { initialize, destroy, initialized } = useUser();

  useEffect(() => {
    if (!user && initialized) {
      destroy();
    }
  }, [user, initialized, destroy]);

  const signIn = async (
    email: string,
    password: string
  ): Promise<UserCredential | string> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;
      setUser({ email: user.email || "", uid: user.uid });
      await initialize({ email: user.email || "", uid: user.uid });
      console.log("useAuth: User sign-in successful");
      return userCredential;
    } catch (error: any) {
      console.error(
        `useAuth signIn ERROR:\nCODE: ${error.code}\nMESSAGE: ${error.message}`
      );
      if (error.code === "auth/invalid-email") {
        return "Invalid email!";
      }
      return error.message || "Error signing in";
    }
  };

  const signUp = async (
    email: string,
    password: string
  ): Promise<UserCredential | string> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;
      setUser({ email: user.email || "", uid: user.uid });
      await sendEmailVerification(user);
      console.log("useAuth: User sign-up successful");
      return userCredential;
    } catch (error: any) {
      console.error(
        `useAuth signUp ERROR:\nCODE: ${error.code}\nMESSAGE: ${error.message}`
      );
      if (error.code === "auth/invalid-email") {
        return "Invalid email!";
      }
      return error.message || "Error signing up";
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      console.log("useAuth: User signed out successfully");
    } catch (error: any) {
      console.error(
        `useAuth signOut ERROR:\nCODE: ${error.code}\nMESSAGE: ${error.message}`
      );
    }
  };

  const updatePassword = async (
    newPassword: string
  ): Promise<void | string> => {
    try {
      if (!auth.currentUser) throw new Error("No authenticated user");
      await firebaseUpdatePassword(auth.currentUser, newPassword);
      console.log("useAuth: Password updated successfully");
    } catch (error: any) {
      console.error(
        `useAuth updatePassword ERROR:\nCODE: ${error.code}\nMESSAGE: ${error.message}`
      );
      return error.message || "Error updating password";
    }
  };

  const updateEmail = async (newEmail: string): Promise<void | string> => {
    try {
      if (!auth.currentUser) throw new Error("No authenticated user");
      await firebaseUpdateEmail(auth.currentUser, newEmail);
      console.log("useAuth: Email updated successfully");
    } catch (error: any) {
      console.error(
        `useAuth updateEmail ERROR:\nCODE: ${error.code}\nMESSAGE: ${error.message}`
      );
      return error.message || "Error updating email";
    }
  };

  return (
    <authContext.Provider
      value={{
        loggedIn: !!user,
        user,
        signUp,
        signIn,
        signOut,
        updatePassword,
        updateEmail,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
