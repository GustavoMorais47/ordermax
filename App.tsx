import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import Auth from "./src/components/auth";
import AuthProvider from "./src/contexts/auth";
import DataProvider from "./src/contexts/data";
import * as Linking from "expo-linking";
import { ActivityIndicator, View } from "react-native";
import FlashMessage from "react-native-flash-message";

const prefix = Linking.createURL("/");

export default function App() {
  const linking: LinkingOptions<ReactNavigation.RootParamList> = {
    prefixes: [prefix],
    config: {
      screens: {
        OrdemServico: {
          screens: {
            OrdemServicoDetalhes: {
              path: "ordem/:id",
              parse: {
                id: (id: any) => `${id}`,
              },
            },
          },
        },
      },
    },
  };
  return (
    <NavigationContainer
      linking={linking}
      fallback={
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      }
    >
      <AuthProvider>
        <DataProvider>
          <Auth />
        </DataProvider>
      </AuthProvider>
      <FlashMessage position="top" />
    </NavigationContainer>
  );
}
