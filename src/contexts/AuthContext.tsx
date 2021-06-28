import { createContext, ReactNode, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { auth, firebase } from "../services/firebase";

type User = {
  id: string,
  name: string,
  avatar: string
}

type AuthContextType = {
  user: User | undefined,
  signInWithGoogle: () => Promise<void>,
}

type AuthContextProviderType = {
  children: ReactNode;
}
export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderType) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          toast.error('Ausência de informações da conta do Google');
          return;
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })

      }
    })

    return () => {
      unsubscribe();
    }
  }, [])

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const res = await auth.signInWithPopup(provider);

    if (res.user) {
      const { displayName, photoURL, uid } = res.user;

      if (!displayName || !photoURL) {
        toast.error('Ausência de informações da conta do Google');
        return;
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }


  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
      <Toaster
        position="bottom-center"
      />
    </AuthContext.Provider>

  );
}