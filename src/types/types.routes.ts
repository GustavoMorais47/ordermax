export type TConsultorRoutes = {
  Dashboard: undefined;
  OrdemServico: undefined;
  Clientes: undefined;
  Concessionarias: undefined;
  Perfil: undefined;
};
export type TMecanicoRoutes = {
  OrdemServico: undefined;
  Perfil: undefined;
};
export type TClienteRoutes = {
  OrdemServico: undefined;
  Concessionarias: undefined;
  Perfil: undefined;
};
export type TOrdemServicoRoutes = {
  OrdemServicoLista: undefined;
  OrdemServicoDetalhes: { id: number | string };
  OrdemServicoCadastrar: undefined;
  QrCode: undefined;
};
