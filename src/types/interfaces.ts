export interface IPessoa {
  _id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string | null;
}

export interface IConcessionaria {
  _id: string;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string | null;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    UF:
      | "AC"
      | "AL"
      | "AP"
      | "AM"
      | "BA"
      | "CE"
      | "DF"
      | "ES"
      | "GO"
      | "MA"
      | "MT"
      | "MS"
      | "MG"
      | "PA"
      | "PB"
      | "PR"
      | "PE"
      | "PI"
      | "RJ"
      | "RN"
      | "RS"
      | "RO"
      | "RR"
      | "SC"
      | "SP"
      | "SE"
      | "TO";
    cep: string;
    coordenadas: {
      latitude: string;
      longitude: string;
    } | null;
  };
  status: boolean;
}

export interface IUsuario {
  _id: string;
  concessionaria: IConcessionaria | null;
  pessoa: IPessoa;
  role: "cl" | "ct" | "mc"; // Cliente, Consultor Técnico, Mecânico
  status: boolean;
}

export interface IModelo {
  _id: string;
  descricao: string;
  imagem: string | null;
  cores: string[];
  status: boolean;
}

export interface IServico {
  _id: string;
  id_concessionaria: string | null;
  descricao: string;
  status: boolean;
}

export interface IOrdem {
  _id: string;
  concessionaria: IConcessionaria;
  modelo: IModelo;
  cliente: IPessoa;
  solicitante: IPessoa;
  responsavel: IPessoa | null;
  placa: string;
  ano: string;
  cor: string;
  ano_fabricacao: string;
  servicos_solicitados: IServico[];
  servicos_realizados: IServico[];
  status: "Aguardando" | "Em andamento" | "Finalizado" | "Cancelado";
}

export interface IHistorico {
  _id: string;
  id_ordem: string;
  data: Date;
  titulo: string;
  descricao: string;
}
