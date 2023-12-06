import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TOrdemServicoRoutes } from "../types/types.routes";
import OrdemServico from "../pages/ordemDeServico";
import OrdemServicoDetalhes from "../pages/ordemDeServico/detalhes";
import QrCode from "../pages/ordemDeServico/qrCode";
import OrdemServicoCadastrar from "../pages/ordemDeServico/cadastrar";

const { Navigator, Screen } = createNativeStackNavigator<TOrdemServicoRoutes>();

export default function OrdemServicoRoutes() {
  return (
    <Navigator
      initialRouteName="OrdemServicoLista"
      screenOptions={{
        animation:"none",
        headerShown: false,
      }}
    >
      <Screen name="OrdemServicoLista" component={OrdemServico} />
      <Screen name="OrdemServicoDetalhes" component={OrdemServicoDetalhes} />
      <Screen name="OrdemServicoCadastrar" component={OrdemServicoCadastrar} />
      <Screen name="QrCode" component={QrCode} />
    </Navigator>
  );
}
