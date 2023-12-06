import {
  Button,
  Dimensions,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Header from "../../components/header";
import Card from "../../components/card";
import { useEffect, useState } from "react";
import Input from "../../components/input";
import { MaterialIcons } from "@expo/vector-icons";
import { useData } from "../../contexts/data";
import { Switch } from "../../components/switch";
import Item from "./item";
import { IConcessionaria } from "../../types/interfaces";

const { width } = Dimensions.get("window");

const renderItem = ({ item }: { item: IConcessionaria }) => (
  <Item item={item} />
);

export default function Concessionarias() {
  const { concessionarias, getConcessionarias } = useData();
  const [loading, setLoading] = useState(false);
  const [concessionariasFiltradas, setConcessionariasFiltradas] =
    useState(concessionarias);
  const [pesquisa, setPesquisa] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [estados, setEstados] = useState<string[]>([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState<string>("Todos");

  function handlePesquisa() {
    if (pesquisa.trim() === "") {
      setConcessionariasFiltradas(
        concessionarias.filter((concessionaria) =>
          estadoSelecionado === "Todos"
            ? true
            : concessionaria.endereco.UF === estadoSelecionado
        )
      );
      return;
    }
    setConcessionariasFiltradas(
      concessionarias.filter((concessionaria) =>
        estadoSelecionado === "Todos"
          ? concessionaria.nome
              .toLowerCase()
              .includes(pesquisa.toLowerCase()) ||
            concessionaria.endereco.cidade
              .toLowerCase()
              .includes(pesquisa.toLowerCase())
          : (concessionaria.endereco.UF === estadoSelecionado &&
              concessionaria.nome
                .toLowerCase()
                .includes(pesquisa.toLowerCase())) ||
            concessionaria.endereco.cidade
              .toLowerCase()
              .includes(pesquisa.toLowerCase())
      )
    );
  }

  useEffect(handlePesquisa, [pesquisa, estados]);

  useEffect(() => {
    setEstados([
      "Todos",
      ...concessionarias
        .map((concessionaria) => concessionaria.endereco.UF)
        .filter((estado, index, self) => self.indexOf(estado) === index)
        .sort((a, b) => a.localeCompare(b)),
    ]);
  }, [concessionarias]);
  return (
    <>
      <Header
        title="Concessionárias"
        subtitle={
          concessionariasFiltradas.length > 1
            ? `Foram encontradas ${concessionariasFiltradas.length} concessionárias`
            : concessionariasFiltradas.length === 1
            ? "Foi encontrada 1 concessionária"
            : "Nenhuma concessionária encontrada"
        }
        recoil={width * 0.09}
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
              placeholder="Pesquise pela concessionária ou cidade"
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
      {!loading ? (
        <FlatList
          data={concessionariasFiltradas.sort((a, b) =>
            a.nome.localeCompare(b.nome)
          )}
          keyExtractor={(concessionaria) => concessionaria._id.toString()}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 10,
          }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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
                marginTop: 20,
              }}
            >
              Nenhuma concessionária encontrada
            </Text>
          )}
          style={{
            marginTop: 10,
          }}
          refreshing={false}
          onRefresh={() => {
            setLoading(true);
            getConcessionarias().finally(() => setLoading(false));
          }}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
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
            <Button
              title="Aplicar"
              onPress={() => {
                setMostrarFiltros(false);
                handlePesquisa();
              }}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
