import { Dimensions, Pressable, View, Text, Alert } from "react-native";
import { IOrdem } from "../../types/interfaces";
import { useData } from "../../contexts/data";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Bar } from "react-native-progress";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { TOrdemServicoRoutes } from "../../types/types.routes";
import services from "../../services";
import { showMessage } from "react-native-flash-message";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth";

interface IProps {
  item: IOrdem;
  index: number;
}

const { width } = Dimensions.get("window");

export default function Item({ item, index }: IProps) {
  const navigation =
    useNavigation<
      NavigationProp<TOrdemServicoRoutes, "OrdemServicoDetalhes">
    >();
  const { usuario } = useAuth();
  const { ordens } = useData();
  const [ordem, setOrdem] = useState<IOrdem>(
    ordens.find((o) => o._id === item._id)!
  );

  useEffect(() => {
    setOrdem(ordens.find((o) => o._id === item._id)!);
  }, [ordem]);
  return (
    <Pressable
      onPress={() =>
        navigation.navigate("OrdemServicoDetalhes", { id: ordem._id })
      }
      onLongPress={() => {
        usuario?.role === "ct" &&
          Alert.alert("Atenção", "O que deseja fazer?", [
            {
              text: "Cancelar O.S",
              onPress: () => {
                Alert.alert(
                  "Atenção",
                  "Deseja mesmo cancelar? Esta ação é irreversível.",
                  [
                    {
                      text: "Não",
                      style: "default",
                    },
                    {
                      text: "Sim",
                      onPress: async () => {
                        await services
                          .put<{
                            status: string;
                          }>(
                            "ordem/status/",
                            {
                              status: "Cancelado",
                            },
                            ordem._id
                          )
                          .then((response) => {
                            showMessage({
                              message: "Sucesso",
                              description: response,
                              type: "success",
                              icon: "success",
                            });
                          })
                          .catch((error) => {
                            showMessage({
                              message: "Erro",
                              description: error,
                              type: "danger",
                              icon: "danger",
                            });
                          });
                      },
                    },
                  ]
                );
              },
              style: "destructive",
            },
            {
              text: "Finalizar O.S",
              onPress: () => {
                Alert.alert(
                  "Atenção",
                  "Deseja mesmo forçar a finalização? Esta ação é irreversível.",
                  [
                    {
                      text: "Não",
                      style: "default",
                    },
                    {
                      text: "Sim",
                      onPress: async () => {
                        await services
                          .put<{
                            status: string;
                          }>(
                            "ordem/status/",
                            {
                              status: "Finalizado",
                            },
                            ordem._id
                          )
                          .then((response) => {
                            showMessage({
                              message: "Sucesso",
                              description: response,
                              type: "success",
                              icon: "success",
                            });
                          })
                          .catch((error) => {
                            showMessage({
                              message: "Erro",
                              description: error,
                              type: "danger",
                              icon: "danger",
                            });
                          });
                      },
                    },
                  ]
                );
              },
            },
            {
              text: "Sair",
              onPress: () => {},
              style: "cancel",
            },
          ]);
      }}
      style={{
        overflow: "hidden",
        backgroundColor: "#fff",
        borderRadius: 15,
        width: (width - 50) / 2,
        height: (width - 50) / 2,
        marginRight: index % 2 === 0 ? 10 : 0,
        paddingTop: 10,
        paddingBottom: ordem.status !== "Em andamento" ? 10 : undefined,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor:
            ordem.status === "Cancelado"
              ? "#BF2424"
              : ordem.status === "Em andamento"
              ? "#D98014"
              : ordem.status === "Finalizado"
              ? "#7EC445"
              : "#000",
          paddingHorizontal: 10,
          paddingVertical: 3,
          borderBottomLeftRadius: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 10,
            color: "#fff",
            textAlign: "center",
            textAlignVertical: "center",
            fontWeight: "bold",
          }}
        >
          {ordem.status}
        </Text>
      </View>
      <View style={{ flex: 3, padding: 5 }}>
        <View
          style={{
            flex: 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {ordem.modelo.imagem ? (
            <Image
              style={{ width: "85%", height: "85%" }}
              source={{ uri: ordem.modelo.imagem }}
              contentFit="contain"
              transition={1000}
              cachePolicy={"disk"}
            />
          ) : (
            <Ionicons
              name="image"
              size={((width - 50) / 2) * 0.4}
              color="rgba(0,0,0,0.08)"
            />
          )}
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {ordem.placa}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "300",
          }}
        >
          {ordem.modelo.descricao}
          {" - "}
          {ordem.cor}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "300",
          }}
        >
          {!ordem.responsavel
            ? "Aguardando atribuição"
            : ordem.responsavel.nome}
        </Text>
      </View>
      {ordem.status === "Em andamento" && (
        <>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "300",
              textAlign: "center",
              textAlignVertical: "center",
              color: "#000",
              marginTop: 5,
            }}
          >
            {(100 /
              ordem.servicos_solicitados.length /
              (100 / ordem.servicos_realizados.length)) *
              100}
            %
          </Text>
          <Bar
            progress={
              100 /
              ordem.servicos_solicitados.length /
              (100 / ordem.servicos_realizados.length)
            }
            width={(width - 50) / 2 + 10}
            height={10}
            color="#000"
            borderWidth={0}
            style={{
              marginHorizontal: -5,
            }}
            unfilledColor="rgba(0,0,0,0.03)"
          />
        </>
      )}
    </Pressable>
  );
}
