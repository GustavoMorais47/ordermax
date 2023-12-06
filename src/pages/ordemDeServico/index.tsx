import { useEffect, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  Dimensions,
  View,
  Text,
  Modal,
  SafeAreaView,
  Button,
} from "react-native";
import { IOrdem } from "../../types/interfaces";
import { MaterialIcons } from "@expo/vector-icons";
import Input from "../../components/input";
import { useData } from "../../contexts/data";
import Card from "../../components/card";
import Header from "../../components/header";
import Item from "./item";
import { useAuth } from "../../contexts/auth";
import { Switch } from "../../components/switch";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { TOrdemServicoRoutes } from "../../types/types.routes";

const { width } = Dimensions.get("window");
const status = [
  "Todos",
  "Aguardando",
  "Em andamento",
  "Finalizado",
  "Cancelado",
];

const renderItem = ({ item, index }: { item: IOrdem; index: number }) => (
  <Item item={item} index={index} />
);

function Footer() {
  return (
    <Text
      style={{
        textAlign: "center",
        fontSize: 12,
        color: "#aaa",
      }}
    >
      Obs: Para{" "}
      <Text
        style={{
          fontWeight: "bold",
        }}
      >
        cancelar
      </Text>{" "}
      uma ordem de serviço pressione e segure sobre ela.
    </Text>
  );
}

export default function OrdemServico() {
  const navigation = useNavigation<NavigationProp<TOrdemServicoRoutes>>();
  const { usuario } = useAuth();
  const { concessionarias, ordens } = useData();
  const [ordensFiltradas, setOrdensFiltradas] = useState<IOrdem[]>(ordens);
  const [pesquisa, setPesquisa] = useState<string>("");
  const [statusSelecionado, setStatusSelecionado] = useState<string>("Todos");
  const [mostrarFiltros, setMostrarFiltros] = useState<boolean>(false);
  const [estados, setEstados] = useState<string[]>([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState<string>(
    !usuario || usuario.role === "cl" || !usuario.concessionaria
      ? "Todos"
      : usuario.concessionaria.endereco.UF
  );

  function handlePesquisa() {
    if (pesquisa.trim() === "") {
      setOrdensFiltradas(
        ordens.filter((ordem) =>
          statusSelecionado === "Todos"
            ? true
            : ordem.status === statusSelecionado
        )
      );
      return;
    }
    setOrdensFiltradas(
      ordens.filter(
        (ordem) =>
          (ordem.placa.toLowerCase().indexOf(pesquisa.toLowerCase()) !== -1 ||
            ordem._id.indexOf(pesquisa) !== -1) &&
          (statusSelecionado === "Todos"
            ? true
            : ordem.status === statusSelecionado)
      )
    );
  }

  useEffect(handlePesquisa, [
    ordens,
    pesquisa,
    estadoSelecionado,
    statusSelecionado,
  ]);

  useEffect(() => {
    setEstados([
      "Todos",
      ...concessionarias
        .map((concessionaria) => concessionaria.endereco.UF)
        .filter((estado, index, self) => self.indexOf(estado) === index)
        .sort((a, b) => a.localeCompare(b)),
    ]);
  }, [usuario, concessionarias]);

  useEffect(() => {
    if (!usuario || usuario.role === "cl") return;
    setEstadoSelecionado(usuario.concessionaria?.endereco.UF ?? "Todos");
  }, [estados]);

  return (
    <>
      <Header
        title="Ordens de Serviço"
        profile={usuario?.role === "mc"}
        subtitle={
          ordensFiltradas.length > 1
            ? `Foram encontradas ${ordensFiltradas.length} ordens de serviço`
            : ordensFiltradas.length === 1
            ? `Foi encontrada 1 ordem de serviço`
            : undefined
        }
        recoil={width * 0.09}
        options={
          <TouchableOpacity
            onPress={() => navigation.navigate("QrCode")}
            style={{
              height: 40,
              width: 40,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="qr-code-scanner" size={24} color="#fff" />
          </TouchableOpacity>
        }
      >
        <Card
          style={{
            marginTop: -width * 0.07,
            marginHorizontal: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 5,
            }}
          >
            <Input
              text={pesquisa}
              onChangeText={setPesquisa}
              placeholder="Pesquise por placa ou O.S"
              style={{ flex: 1 }}
            />
            <TouchableOpacity
              onPress={() => {
                setMostrarFiltros(true);
              }}
              style={{
                height: 40,
                width: 25,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="more-vert" size={25} color="#000" />
            </TouchableOpacity>
          </View>
        </Card>
      </Header>
      <FlatList
        data={ordensFiltradas}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => String(index)}
        numColumns={2}
        contentContainerStyle={{
          gap: 10,
          marginHorizontal: 20,
          paddingBottom: usuario?.role === "ct" ? 60 : 10,
        }}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
              color: "#bbb",
              maxWidth: "80%",
              alignSelf: "center",
            }}
          >
            Nenhuma ordem de serviço encontrada
          </Text>
        )}
        ListFooterComponent={
          usuario?.role === "ct" && ordensFiltradas.length > 0 ? (
            <Footer />
          ) : null
        }
        ListFooterComponentStyle={{
          marginBottom: 5,
        }}
        style={{
          marginTop: 10,
        }}
      />
      {usuario?.role === "ct" && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("OrdemServicoCadastrar");
          }}
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            backgroundColor: "#000",
            borderRadius: 100,
            padding: 5,
          }}
        >
          <MaterialIcons name="add" size={40} color="#fff" />
        </TouchableOpacity>
      )}
      <Modal transparent visible={mostrarFiltros}>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "#00000033",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 10,
              width: "90%",
              gap: 10,
            }}
          >
            {(!usuario || usuario.role === "cl") && (
              <View style={{ gap: 10 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Estados
                </Text>
                <Switch
                  options={[
                    {
                      label: "Todos",
                      value: "Todos",
                    },
                    ...concessionarias
                      .map((concessionaria) => concessionaria.endereco.UF)
                      .filter(
                        (estado, index, self) => self.indexOf(estado) === index
                      )
                      .sort((a, b) => a.localeCompare(b))
                      .map((estado) => ({ label: estado, value: estado })),
                  ]}
                  selected={estadoSelecionado}
                  setSelected={(selecionado) => {
                    if (selecionado) setEstadoSelecionado(selecionado);
                  }}
                />
              </View>
            )}
            <View style={{ gap: 10 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Status
              </Text>
              <Switch
                options={status.map((status) => ({
                  label: status,
                  value: status,
                }))}
                selected={statusSelecionado}
                setSelected={(selecionado) => {
                  if (selecionado) setStatusSelecionado(selecionado);
                }}
              />
            </View>
            <Button
              title="Fechar"
              onPress={() => {
                setMostrarFiltros(false);
              }}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
