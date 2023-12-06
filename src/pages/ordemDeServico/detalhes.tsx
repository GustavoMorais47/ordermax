import { useEffect, useState } from "react";
import { useData } from "../../contexts/data";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { TOrdemServicoRoutes } from "../../types/types.routes";
import Card from "../../components/card";
import {
  ScrollView,
  View,
  Text,
  Button,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Bar } from "react-native-progress";
import { useAuth } from "../../contexts/auth";
import { IOrdem } from "../../types/interfaces";
import Header from "../../components/header";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import mascaras from "../../utils/mascaras";
import { MultiSwitch } from "../../components/switch";
import QRCode from "react-native-qrcode-svg";
import * as Linking from "expo-linking";
import * as Clipboard from "expo-clipboard";
import services from "../../services";
import { showMessage } from "react-native-flash-message";

const prefix = Linking.createURL("/");
const { width } = Dimensions.get("window");

export default function OrdemServicoDetalhes() {
  const { params } =
    useRoute<RouteProp<TOrdemServicoRoutes, "OrdemServicoDetalhes">>();
  const { ordens } = useData();
  const { usuario } = useAuth();
  const [ordem, setOrdem] = useState<IOrdem | null>(null);
  const navigation = useNavigation();

  function handleFinalizar() {
    Alert.alert(
      "Atenção!",
      "Deseja realmente finalizar a ordem de serviço? Essa ação não poderá ser desfeita.",
      [
        {
          text: "Não",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: async () => {
            await services
              .put<{
                servicos_realizados: string[];
              }>(
                "ordem/servicos/",
                {
                  servicos_realizados: ordem!.servicos_realizados.map(
                    (servico) => servico._id
                  ),
                },
                ordem!._id
              )
              .then(async () => {
                await services
                  .put<{
                    status: string;
                  }>(
                    "ordem/status/",
                    {
                      status: "Finalizado",
                    },
                    ordem!._id
                  )
                  .then((mensagem) => {
                    showMessage({
                      message: "Sucesso!",
                      description: mensagem,
                      type: "success",
                      icon: "success",
                    });
                    navigation.goBack();
                  })
                  .catch((mensagem) => {
                    showMessage({
                      message: "Erro!",
                      description: mensagem,
                      type: "danger",
                      icon: "danger",
                    });
                  });
              })
              .catch((mensagem) => {
                showMessage({
                  message: "Erro!",
                  description: mensagem,
                  type: "danger",
                  icon: "danger",
                });
              });
          },
        },
      ]
    );
  }

  async function handleAtualizarServicos() {
    await services
      .put<{
        servicos_realizados: string[];
      }>(
        "ordem/servicos/",
        {
          servicos_realizados: ordem!.servicos_realizados.map(
            (servico) => servico._id
          ),
        },
        ordem!._id
      )
      .then((mensagem) => {
        showMessage({
          message: "Sucesso!",
          description: mensagem,
          type: "success",
          icon: "success",
        });
      })
      .catch((mensagem) => {
        showMessage({
          message: "Erro!",
          description: mensagem,
          type: "danger",
          icon: "danger",
        });
      });
  }

  function handleAtender() {
    Alert.alert(
      "Atenção!",
      "Deseja realmente atender a ordem de serviço? Essa ação não poderá ser desfeita.",
      [
        {
          text: "Não",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: async () => {
            await services
              .put<{
                id_responsavel: string;
              }>(
                "ordem/responsavel/",
                {
                  id_responsavel: usuario?._id!,
                },
                ordem!._id
              )
              .then((mensagem) => {
                showMessage({
                  message: "Sucesso!",
                  description: mensagem,
                  type: "success",
                  icon: "success",
                });
              })
              .catch((mensagem) => {
                showMessage({
                  message: "Erro!",
                  description: mensagem,
                  type: "danger",
                  icon: "danger",
                });
              });
          },
        },
      ]
    );
  }

  function handleIniciar() {
    Alert.alert(
      "Atenção!",
      "Deseja realmente iniciar a ordem de serviço? Essa ação não poderá ser desfeita.",
      [
        {
          text: "Não",
          style: "cancel",
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
                  status: "Em andamento",
                },
                ordem!._id
              )
              .then((mensagem) => {
                showMessage({
                  message: "Sucesso!",
                  description: mensagem,
                  type: "success",
                  icon: "success",
                });
              })
              .catch((mensagem) => {
                showMessage({
                  message: "Erro!",
                  description: mensagem,
                  type: "danger",
                  icon: "danger",
                });
              });
          },
        },
      ]
    );
  }

  useEffect(() => {
    const ordem = ordens.find((ordem) => ordem._id == params.id);
    if (ordem) setOrdem(ordem);
    else {
      Alert.alert("Erro", "Ocorreu um erro ao carregar a ordem de serviço.");
      navigation.goBack();
    }
  }, []);

  return (
    <>
      <Header
        goBack
        title={
          ordem === null ? "Detalhes da O.S" : "O.S " + ordem._id.slice(-6)
        }
        subtitle={
          ordem?.solicitante
            ? "Solicitada por " + ordem.solicitante.nome
            : undefined
        }
        recoil={15}
        options={
          !ordem ? undefined : (
            <TouchableOpacity
              onPress={() => {
                Alert.alert("Histórico", "Funcionalidade em desenvolvimento.");
              }}
              style={{
                height: 40,
                width: 40,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome name="history" size={24} color="#fff" />
            </TouchableOpacity>
          )
        }
        optionsTop={
          usuario?.role === "mc" &&
          ordem?.status === "Em andamento" &&
          ordem?.responsavel?._id === usuario.pessoa._id && (
            <TouchableOpacity
              style={{
                height: 40,
                width: 40,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={handleAtualizarServicos}
            >
              <Ionicons name="save" size={24} color="#fff" />
            </TouchableOpacity>
          )
        }
      />
      {!ordem ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <View
            style={{
              backgroundColor:
                ordem.status === "Cancelado"
                  ? "#BF2424"
                  : ordem.status === "Em andamento"
                  ? "#D98014"
                  : ordem.status === "Finalizado"
                  ? "#7EC445"
                  : "#000",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#fff",
                fontSize: 12,
                fontWeight: "bold",
                padding: 2,
              }}
            >
              {ordem.status}
            </Text>
          </View>
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              gap: 10,
            }}
          >
            <Card title="Veículo" subTitle="Informações do veículo">
              <View style={{ gap: 10 }}>
                <View
                  style={{
                    flexGrow: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "bold" }}>Placa</Text>
                    <Text>{ordem.placa}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "bold" }}>Modelo</Text>
                    <Text>{ordem.modelo.descricao}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "bold" }}>Cor</Text>
                    <Text>{ordem.cor}</Text>
                  </View>
                </View>
                <View
                  style={{
                    flexGrow: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "bold" }}>Ano Fabricação</Text>
                    <Text>{ordem.ano_fabricacao}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "bold" }}>Ano Modelo</Text>
                    <Text>{ordem.ano}</Text>
                  </View>
                  <View style={{ flex: 1 }} />
                </View>
              </View>
            </Card>
            {(usuario?.role === "ct" || usuario?.role === "mc") && (
              <Card title="Cliente" subTitle="Informações do cliente">
                <View style={{ gap: 5 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "bold" }}>Nome</Text>
                    <Text>{ordem.cliente.nome}</Text>
                  </View>
                  {usuario?.role === "ct" && (
                    <>
                      <View style={{ flex: 1, gap: 3 }}>
                        <Text style={{ fontWeight: "bold" }}>E-mail</Text>
                        <TouchableOpacity
                          disabled={!!ordem.cliente.email}
                          onPress={() => {
                            Linking.openURL(
                              "mailto:" +
                                ordem.cliente.email +
                                "?subject=Ordem de serviço " +
                                ordem._id
                            );
                          }}
                        >
                          <Text
                            style={{
                              color: ordem.cliente.email ? "#0000FF" : "#000",
                              textDecorationLine: ordem.cliente.email
                                ? "underline"
                                : "none",
                            }}
                          >
                            {ordem.cliente.email ? ordem.cliente.email : "-"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{ flex: 1, gap: 3 }}>
                        <Text style={{ fontWeight: "bold" }}>Telefone</Text>
                        <TouchableOpacity
                          onPress={() => {
                            Linking.openURL("tel:" + ordem.cliente.telefone);
                          }}
                        >
                          <Text
                            style={{
                              color: "#0000FF",
                              textDecorationLine: "underline",
                            }}
                          >
                            {mascaras.telefone(ordem.cliente.telefone)}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              </Card>
            )}
            <Card title="Serviços" subTitle="Veja os serviços solicitados">
              <MultiSwitch
                disabled={
                  ordem.status !== "Em andamento" || usuario?.role !== "mc"
                }
                options={ordem.servicos_solicitados.map((servico) => ({
                  label: servico.descricao,
                  value: servico._id,
                }))}
                selecteds={ordem.servicos_realizados.map(
                  (servico) => servico._id
                )}
                setSelected={(value) => {
                  const servico = ordem.servicos_solicitados.find(
                    (serv) => serv._id === value
                  )!;
                  if (ordem.servicos_realizados.indexOf(servico) > -1) {
                    const novoservicos_realizados =
                      ordem.servicos_realizados.filter(
                        (servico) => servico._id !== value
                      );
                    setOrdem({
                      ...ordem,
                      servicos_realizados: novoservicos_realizados,
                    });
                  } else {
                    const servico = ordem.servicos_solicitados.find(
                      (serv) => serv._id === value
                    )!;
                    const novoservicos_realizados = ordem.servicos_realizados;
                    novoservicos_realizados.push(servico);
                    setOrdem({
                      ...ordem,
                      servicos_realizados: novoservicos_realizados,
                    });
                  }
                }}
              />
            </Card>
            {ordem.status === "Aguardando" &&
              usuario?.role === "mc" &&
              ordem.responsavel?._id === usuario.pessoa._id && (
                <Card>
                  <Button title="Iniciar O.S." onPress={handleIniciar} />
                </Card>
              )}
            {ordem.status === "Aguardando" &&
              usuario?.role === "mc" &&
              ordem.responsavel === null && (
                <Card>
                  <Button title="Atender" onPress={handleAtender} />
                </Card>
              )}
            {ordem.status === "Em andamento" && (
              <Card title="Progresso" subTitle="Veja o progresso da O.S.">
                {100 /
                  ordem.servicos_solicitados.length /
                  (100 / ordem.servicos_realizados.length) ==
                  1 && usuario?.role === "mc" ? (
                  <Button title="Finalizar" onPress={handleFinalizar} />
                ) : (
                  <>
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          textAlign: "center",
                          textAlignVertical: "center",
                          color:
                            100 /
                              ordem.servicos_solicitados.length /
                              (100 / ordem.servicos_realizados.length) >=
                            0.46
                              ? "#fff"
                              : "#000",
                        }}
                      >
                        {(100 /
                          ordem.servicos_solicitados.length /
                          (100 / ordem.servicos_realizados.length)) *
                          100}
                        %
                      </Text>
                    </View>
                    <Bar
                      progress={
                        100 /
                        ordem.servicos_solicitados.length /
                        (100 / ordem.servicos_realizados.length)
                      }
                      width={null}
                      height={30}
                      style={{ flex: 1 }}
                      color="#000"
                      borderWidth={0}
                      animated={true}
                      unfilledColor="rgba(0,0,0,0.03)"
                      animationType="timing"
                    />
                  </>
                )}
              </Card>
            )}
            <Card title="QR Code">
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: "300",
                  }}
                >
                  Clique no QR Code para copiar o link.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Clipboard.setUrlAsync(prefix + "ordem/" + ordem._id);
                    Alert.alert("Link copiado para a área de transferência.");
                  }}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <QRCode
                    value={prefix + "ordem/" + ordem._id}
                    size={(width - 60) * 0.5}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: "300",
                  }}
                >
                  {prefix + "ordem/" + ordem._id}
                </Text>
              </View>
            </Card>
          </ScrollView>
        </>
      )}
    </>
  );
}
