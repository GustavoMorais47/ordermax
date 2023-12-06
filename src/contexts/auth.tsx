import { createContext, useContext, useEffect, useState } from "react";
import { IUsuario } from "../types/interfaces";
import { Alert } from "react-native";

interface AuthContextData {
  usuario: IUsuario | null;
  setUsuario: React.Dispatch<React.SetStateAction<IUsuario | null>>;
}

const AuthContext = createContext<AuthContextData>(null!);

export function useAuth() {
  const { usuario, setUsuario } = useContext(AuthContext);
  return { usuario, setUsuario };
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [usuario, setUsuario] = useState<IUsuario | null>(null);

  useEffect(() => {
    Alert.alert(
      "Bem vindo!",
      "Seja bem vindo ao aplicativo da concessionária, aqui você poderá ver as ordens de serviço, clientes e muito mais!"
    );
  }, []);
  return (
    <AuthContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}
