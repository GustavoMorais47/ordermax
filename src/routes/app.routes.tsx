import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  TClienteRoutes,
  TConsultorRoutes,
  TMecanicoRoutes,
} from "../types/types.routes";
import { Ionicons } from "@expo/vector-icons";
import OrdemServicoRoutes from "./ordem.routes";
import Header from "../components/header";
import Concessionarias from "../pages/concessionarias";
import Clientes from "../pages/clientes";
import Perfil from "../pages/perfil";

const Consultor = createBottomTabNavigator<TConsultorRoutes>();
const Mecanico = createNativeStackNavigator<TMecanicoRoutes>();
const Cliente = createBottomTabNavigator<TClienteRoutes>();

function ConsultorRoutes() {
  return (
    <Consultor.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarShowLabel: false,
      }}
    >
      <Consultor.Screen
        name="Dashboard"
        component={Ex}
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "ios-bar-chart" : "ios-bar-chart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Consultor.Screen
        name="OrdemServico"
        component={OrdemServicoRoutes}
        options={{
          headerShown: false,
          title: "Ordens de Serviço",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "document-text" : "document-text-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Consultor.Screen
        name="Clientes"
        component={Clientes}
        options={{
          title: "Clientes",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Consultor.Screen
        name="Concessionarias"
        component={Concessionarias}
        options={{
          title: "Concessionárias",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "business" : "business-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Consultor.Screen
        name="Perfil"
        component={Perfil}
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Consultor.Navigator>
  );
}

function MecanicoRoutes() {
  return (
    <Mecanico.Navigator initialRouteName="OrdemServico">
      <Mecanico.Screen
        name="OrdemServico"
        component={OrdemServicoRoutes}
        options={{ headerShown: false }}
      />
      <Mecanico.Screen
        name="Perfil"
        component={Perfil}
        options={{
          title: "Perfil",
          headerShown: false,
        }}
      />
    </Mecanico.Navigator>
  );
}

function ClienteRoutes() {
  return (
    <Cliente.Navigator
      initialRouteName="OrdemServico"
      screenOptions={{
        tabBarActiveTintColor: "#000",
        headerShown: false,
      }}
    >
      <Cliente.Screen
        name="OrdemServico"
        component={OrdemServicoRoutes}
        options={{
          headerShown: false,
          title: "Ordens de Serviço",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "document-text" : "document-text-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Cliente.Screen
        name="Concessionarias"
        component={Concessionarias}
        options={{
          title: "Concessionárias",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "business" : "business-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Cliente.Screen
        name="Perfil"
        component={Perfil}
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Cliente.Navigator>
  );
}

const Ex = () => (
  <>
    <Header title="Em desenvolvimento" />
  </>
);

export default {
  ConsultorRoutes,
  MecanicoRoutes,
  ClienteRoutes,
};
