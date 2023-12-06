import { createContext, useContext, useEffect, useState } from "react";
import {
  IConcessionaria,
  IModelo,
  IOrdem,
  IPessoa,
  IServico,
} from "../types/interfaces";
import services from "../services";
import { useAuth } from "./auth";
import io from "socket.io-client";

interface DataContextData {
  concessionarias: IConcessionaria[];
  clientes: IPessoa[];
  modelos: IModelo[];
  ordens: IOrdem[];
  servicos: IServico[];
  background: string | null;
  getConcessionarias: () => Promise<void>;
  getClientes: () => Promise<void>;
  getServicos: () => Promise<void>;
  getModelos: () => Promise<void>;
}

const DataContext = createContext<DataContextData>(null!);

export function useData() {
  const {
    ordens,
    clientes,
    servicos,
    modelos,
    concessionarias,
    background,
    getConcessionarias,
    getClientes,
    getServicos,
    getModelos,
  } = useContext(DataContext);
  return {
    ordens,
    clientes,
    servicos,
    modelos,
    concessionarias,
    background,
    getConcessionarias,
    getClientes,
    getServicos,
    getModelos,
  };
}

export default function DataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { usuario } = useAuth();
  const [concessionarias, setConcessionarias] = useState<IConcessionaria[]>([]);
  const [clientes, setUsuario] = useState<IPessoa[]>([]);
  const [modelos, setModelos] = useState<IModelo[]>([]);
  const [ordens, setOrdens] = useState<IOrdem[]>([]);
  const [servicos, setServicos] = useState<IServico[]>([]);
  const [background, setBackground] = useState<string | null>(null);

  const getConcessionarias = async () => {
    try {
      const response = await services.get<IConcessionaria[]>("concessionaria/");
      setConcessionarias(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getClientes = async () => {
    try {
      const response = await services.get<IPessoa[]>("cliente/");
      setUsuario(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getServicos = async () => {
    try {
      const response = await services.get<IServico[]>("servico/");
      setServicos(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getModelos = async () => {
    try {
      const response = await services.get<IModelo[]>("modelo/");
      setModelos(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setConcessionarias([]);
    setUsuario([]);
    setModelos([]);
    setOrdens([]);
    setServicos([]);
    const socket = io(process.env.EXPO_PUBLIC_API_URL as string);
    usuario?.role !== "mc" && getConcessionarias();
    if (usuario?.role === "ct") {
      getClientes();
      getServicos();
      getModelos();
    }

    if (usuario?.role !== undefined) {
      socket.on("connect", () => {
        socket.emit("ordens", usuario?.role);
        socket.on("ordens", (data: IOrdem[]) => {
          setOrdens(data);
        });
        socket.on("ordens_create", (data: IOrdem) => {
          setOrdens((temp) => [...temp, data]);
        });
        socket.on("ordens_update", (data: IOrdem) => {
          const temp = [...ordens];
          const index = temp.findIndex((ordem) => ordem._id === data._id);
          temp.splice(index, 1);
          temp.push(data);
          setOrdens(temp);
        });
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [usuario]);

  return (
    <DataContext.Provider
      value={{
        concessionarias,
        clientes,
        ordens,
        servicos,
        modelos,
        background,
        getConcessionarias,
        getClientes,
        getServicos,
        getModelos,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
