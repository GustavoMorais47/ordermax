import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { TOrdemServicoRoutes } from "../../types/types.routes";
import Card from "../../components/card";
import Input from "../../components/input";
import Header from "../../components/header";

export default function QrCode() {
  const navigation = useNavigation<NavigationProp<TOrdemServicoRoutes>>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [link, setLink] = useState("");

  const getBarCodeScannerPermissions = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }: any) => {
    setScanned(true);
    const id = data.split("/")[data.split("/").length - 1];
    Alert.alert("Atenção", `Deseja abrir a ordem de serviço ${id}?`, [
      {
        text: "Sim",
        onPress: () => {
          setScanned(false);
          navigation.navigate("OrdemServicoDetalhes", { id });
        },
      },
      {
        text: "Não",
        onPress: () => {
          setScanned(false);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {!hasPermission ? (
        <>
          <Header
            title="Ler QR Code"
            subtitle="A permissão de acesso à câmera é necessária para ler o QR Code."
            goBack
          />
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
              gap: 10,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Ops! Parece que você não permitiu o acesso à câmera do seu celular
            </Text>
            <Text
              style={{
                fontSize: 14,
                textAlign: "center",
                fontWeight: "300",
              }}
            >
              Para ler o QR Code de uma ordem de serviço, é necessário permitir
              o acesso à câmera. Para isso, clique no botão abaixo.
            </Text>
            <Button
              title={"Permitir Acesso"}
              onPress={getBarCodeScannerPermissions}
            />
          </View>
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              position: "absolute",
              top: 50,
              left: 20,
              zIndex: 999,
              backgroundColor: "rgba(0,0,0,0.5)",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "#fff",
              }}
            >
              Cancelar
            </Text>
          </TouchableOpacity>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
